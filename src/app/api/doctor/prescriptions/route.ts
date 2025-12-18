import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const prescriptions = await prisma.prescription.findMany({
      where: {
        doctorId,
        ...(search && {
          OR: [
            { patient: { name: { contains: search } } },
            { diagnosis: { contains: search } },
          ],
        }),
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format prescriptions
    const formattedPrescriptions = prescriptions.map((pres) => {
      // Safely handle medications
      let medicationsCount = 0;
      let medicationsList: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
      }> = [];

      if (Array.isArray(pres.medications)) {
        medicationsCount = pres.medications.length;
        medicationsList = pres.medications.map((med: unknown) => {
          const m = med as { name?: string; dosage?: string; frequency?: string; duration?: string };
          return {
            name: m.name || "",
            dosage: m.dosage || "",
            frequency: m.frequency || "",
            duration: m.duration || "",
          };
        });
      } else if (pres.medications && typeof pres.medications === "object") {
        const med = pres.medications as { name?: string; dosage?: string; frequency?: string; duration?: string };
        if (med.name) {
          medicationsCount = 1;
          medicationsList = [{
            name: med.name || "",
            dosage: med.dosage || "",
            frequency: med.frequency || "",
            duration: med.duration || "",
          }];
        }
      }

      // Determine status based on validUntil
      const isActive = pres.validUntil ? new Date(pres.validUntil) > new Date() : true;

      return {
        id: pres.id,
        patient: pres.patient.name,
        patientId: pres.patient.id,
        patientAvatar: pres.patient.avatar,
        date: pres.createdAt,
        diagnosis: pres.diagnosis,
        medications: medicationsList,
        medicationsCount,
        instructions: pres.instructions,
        validUntil: pres.validUntil,
        status: isActive ? "active" : "completed",
      };
    });

    return NextResponse.json({
      prescriptions: formattedPrescriptions,
    });
  } catch (error) {
    console.error("Doctor prescriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);
    const body = await request.json();
    const { patientId, diagnosis, medications, instructions, validUntil } = body;

    if (!patientId || !diagnosis || !medications || medications.length === 0) {
      return NextResponse.json(
        { error: "Patient, diagnosis, and medications are required" },
        { status: 400 }
      );
    }

    // Verify the patient exists and has an appointment with this doctor
    const patientAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        patientId: parseInt(patientId),
      },
    });

    if (!patientAppointment) {
      return NextResponse.json(
        { error: "Patient not found in your records" },
        { status: 404 }
      );
    }

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        doctorId,
        patientId: parseInt(patientId),
        diagnosis,
        medications,
        instructions: instructions || null,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
      include: {
        patient: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Create prescription error:", error);
    return NextResponse.json(
      { error: "Failed to create prescription" },
      { status: 500 }
    );
  }
}
