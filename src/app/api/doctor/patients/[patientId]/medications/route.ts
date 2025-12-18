import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch patient's current active medications
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.type !== "doctor") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { patientId } = await params;
    const patientIdNum = parseInt(patientId);

    if (isNaN(patientIdNum)) {
      return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
    }

    // Get the doctor's hospital
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
      select: { hospitalId: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Verify patient belongs to same hospital
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientIdNum,
        hospitalId: doctor.hospitalId,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Get active prescriptions from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const activePrescriptions = await prisma.prescription.findMany({
      where: {
        patientId: patientIdNum,
        status: "active",
        OR: [
          { validUntil: null },
          { validUntil: { gte: new Date() } },
        ],
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        medications: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Extract unique medication names
    const medicationSet = new Set<string>();

    for (const prescription of activePrescriptions) {
      const meds = prescription.medications as { name: string }[];
      if (Array.isArray(meds)) {
        meds.forEach((med) => {
          if (med.name) {
            medicationSet.add(med.name.toLowerCase().trim());
          }
        });
      }
    }

    return NextResponse.json({
      medications: Array.from(medicationSet),
    });
  } catch (error) {
    console.error("Error fetching patient medications:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient medications" },
      { status: 500 }
    );
  }
}
