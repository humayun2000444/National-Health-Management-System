import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch emergency cases with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.type !== "admin" && session.user.type !== "doctor") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const hospitalId = session.user.hospitalId;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const triageLevel = searchParams.get("triageLevel");

    const where: Record<string, unknown> = { hospitalId };

    if (status && status !== "all") {
      where.status = status;
    }

    if (triageLevel && triageLevel !== "all") {
      where.triageLevel = triageLevel;
    }

    const emergencyCases = await prisma.emergencyCase.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
            bloodGroup: true,
            dateOfBirth: true,
            gender: true,
            allergies: true,
          },
        },
      },
      orderBy: [
        { triageLevel: "asc" }, // Most critical first
        { arrivalTime: "asc" }, // Then by arrival time
      ],
    });

    // Get statistics
    const stats = await prisma.emergencyCase.groupBy({
      by: ["status"],
      where: { hospitalId },
      _count: true,
    });

    const triageStats = await prisma.emergencyCase.groupBy({
      by: ["triageLevel"],
      where: {
        hospitalId,
        status: { in: ["waiting", "in_treatment"] },
      },
      _count: true,
    });

    return NextResponse.json({
      cases: emergencyCases.map((c) => ({
        id: c.id,
        patient: c.patient
          ? {
              id: c.patient.id,
              name: c.patient.name,
              phone: c.patient.phone,
              bloodGroup: c.patient.bloodGroup,
              age: c.patient.dateOfBirth
                ? Math.floor(
                    (new Date().getTime() - new Date(c.patient.dateOfBirth).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )
                : null,
              gender: c.patient.gender,
              allergies: c.patient.allergies,
            }
          : null,
        patientName: c.patientName || c.patient?.name,
        patientAge: c.patientAge,
        patientGender: c.patientGender || c.patient?.gender,
        contactPhone: c.contactPhone || c.patient?.phone,
        triageLevel: c.triageLevel,
        chiefComplaint: c.chiefComplaint,
        vitalSigns: c.vitalSigns,
        status: c.status,
        assignedDoctorId: c.assignedDoctorId,
        arrivalTime: c.arrivalTime,
        treatmentStartTime: c.treatmentStartTime,
        dischargeTime: c.dischargeTime,
        disposition: c.disposition,
        notes: c.notes,
        createdAt: c.createdAt,
        waitTime: c.status === "waiting"
          ? Math.floor((new Date().getTime() - new Date(c.arrivalTime).getTime()) / 60000)
          : null,
      })),
      stats: {
        total: emergencyCases.length,
        byStatus: Object.fromEntries(stats.map((s) => [s.status, s._count])),
        byTriage: Object.fromEntries(triageStats.map((s) => [s.triageLevel, s._count])),
      },
    });
  } catch (error) {
    console.error("Error fetching emergency cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch emergency cases" },
      { status: 500 }
    );
  }
}

// POST - Create new emergency case
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.type !== "admin" && session.user.type !== "doctor") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const hospitalId = session.user.hospitalId;
    const body = await request.json();

    const {
      patientId,
      patientName,
      patientAge,
      patientGender,
      contactPhone,
      triageLevel,
      chiefComplaint,
      vitalSigns,
      notes,
    } = body;

    if (!triageLevel || !chiefComplaint) {
      return NextResponse.json(
        { error: "Triage level and chief complaint are required" },
        { status: 400 }
      );
    }

    // If patientId is provided, verify patient exists
    if (patientId) {
      const patient = await prisma.patient.findFirst({
        where: { id: parseInt(patientId), hospitalId },
      });
      if (!patient) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }
    }

    const emergencyCase = await prisma.emergencyCase.create({
      data: {
        patientId: patientId ? parseInt(patientId) : null,
        hospitalId,
        patientName,
        patientAge: patientAge ? parseInt(patientAge) : null,
        patientGender,
        contactPhone,
        triageLevel,
        chiefComplaint,
        vitalSigns: vitalSigns || null,
        notes,
        status: "waiting",
      },
      include: {
        patient: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    return NextResponse.json({ case: emergencyCase }, { status: 201 });
  } catch (error) {
    console.error("Error creating emergency case:", error);
    return NextResponse.json(
      { error: "Failed to create emergency case" },
      { status: 500 }
    );
  }
}

// PATCH - Update emergency case status
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.type !== "admin" && session.user.type !== "doctor") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const hospitalId = session.user.hospitalId;
    const body = await request.json();
    const { id, status, assignedDoctorId, disposition, notes, triageLevel } = body;

    if (!id) {
      return NextResponse.json({ error: "Case ID is required" }, { status: 400 });
    }

    // Verify case exists and belongs to hospital
    const existingCase = await prisma.emergencyCase.findFirst({
      where: { id: parseInt(id), hospitalId },
    });

    if (!existingCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
      if (status === "in_treatment" && !existingCase.treatmentStartTime) {
        updateData.treatmentStartTime = new Date();
      }
      if (status === "discharged" || status === "admitted" || status === "transferred") {
        updateData.dischargeTime = new Date();
        if (disposition) {
          updateData.disposition = disposition;
        } else {
          updateData.disposition = status;
        }
      }
    }

    if (assignedDoctorId !== undefined) {
      updateData.assignedDoctorId = assignedDoctorId ? parseInt(assignedDoctorId) : null;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (triageLevel) {
      updateData.triageLevel = triageLevel;
    }

    const updatedCase = await prisma.emergencyCase.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        patient: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    return NextResponse.json({ case: updatedCase });
  } catch (error) {
    console.error("Error updating emergency case:", error);
    return NextResponse.json(
      { error: "Failed to update emergency case" },
      { status: 500 }
    );
  }
}
