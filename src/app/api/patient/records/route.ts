import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Fetch patient medical records
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { email: session.user.email! },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Build filter
    const where: Record<string, unknown> = {
      patientId: patient.id,
    };

    if (type && type !== "all") {
      where.type = type;
    }

    // Fetch medical records
    const records = await prisma.medicalRecord.findMany({
      where,
      include: {
        doctor: {
          select: {
            name: true,
            specialization: true,
            avatar: true,
          },
        },
      },
      orderBy: { recordDate: "desc" },
    });

    // Format records
    const formattedRecords = records.map((record) => {
      // Safely handle attachments
      let attachments: string[] = [];
      if (Array.isArray(record.attachments)) {
        attachments = record.attachments as string[];
      }

      return {
        id: record.id,
        type: record.type,
        title: record.title,
        description: record.description,
        doctor: record.doctor.name,
        specialization: record.doctor.specialization,
        avatar: record.doctor.avatar,
        date: record.recordDate.toISOString().split("T")[0],
        attachments,
        createdAt: record.createdAt.toISOString(),
      };
    });

    // Calculate counts by type
    const allRecords = await prisma.medicalRecord.groupBy({
      by: ["type"],
      where: { patientId: patient.id },
      _count: { type: true },
    });

    const counts: Record<string, number> = {
      diagnosis: 0,
      lab_report: 0,
      imaging: 0,
      vaccination: 0,
      total: 0,
    };

    allRecords.forEach((item) => {
      counts[item.type] = item._count.type;
      counts.total += item._count.type;
    });

    return NextResponse.json({
      records: formattedRecords,
      counts,
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical records" },
      { status: 500 }
    );
  }
}
