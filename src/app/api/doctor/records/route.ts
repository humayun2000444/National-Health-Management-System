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
    const type = searchParams.get("type");

    const records = await prisma.medicalRecord.findMany({
      where: {
        doctorId,
        ...(type && { type }),
        ...(search && {
          OR: [
            { patient: { name: { contains: search } } },
            { title: { contains: search } },
            { description: { contains: search } },
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
        recordDate: "desc",
      },
    });

    // Format records
    const formattedRecords = records.map((record) => ({
      id: record.id,
      patient: record.patient.name,
      patientId: record.patient.id,
      patientAvatar: record.patient.avatar,
      type: record.type,
      title: record.title,
      description: record.description,
      date: record.recordDate,
      attachments: record.attachments,
      createdAt: record.createdAt,
    }));

    // Get type counts
    const typeCounts = await prisma.medicalRecord.groupBy({
      by: ["type"],
      where: { doctorId },
      _count: { type: true },
    });

    const counts: Record<string, number> = {};
    typeCounts.forEach((tc) => {
      counts[tc.type] = tc._count.type;
    });

    return NextResponse.json({
      records: formattedRecords,
      counts,
    });
  } catch (error) {
    console.error("Doctor records error:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
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
    const { patientId, type, title, description, recordDate, attachments } = body;

    if (!patientId || !type || !title) {
      return NextResponse.json(
        { error: "Patient, type, and title are required" },
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

    // Create medical record
    const record = await prisma.medicalRecord.create({
      data: {
        doctorId,
        patientId: parseInt(patientId),
        type,
        title,
        description: description || null,
        recordDate: recordDate ? new Date(recordDate) : new Date(),
        attachments: attachments || null,
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
      message: "Medical record created successfully",
      record,
    });
  } catch (error) {
    console.error("Create record error:", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}
