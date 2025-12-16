import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Medication {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

// GET - Fetch patient prescriptions
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
    const status = searchParams.get("status");

    // Fetch prescriptions
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        doctor: {
          select: {
            name: true,
            specialization: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    // Format prescriptions
    const formattedPrescriptions = prescriptions.map((pres) => {
      // Safely handle medications
      let medications: Medication[] = [];
      if (Array.isArray(pres.medications)) {
        medications = pres.medications as Medication[];
      } else if (pres.medications && typeof pres.medications === "object") {
        medications = [pres.medications as Medication];
      }

      const isExpired = pres.validUntil && new Date(pres.validUntil) < now;
      const prescriptionStatus = isExpired ? "expired" : "active";

      return {
        id: pres.id,
        doctor: pres.doctor.name,
        specialization: pres.doctor.specialization,
        avatar: pres.doctor.avatar,
        date: pres.createdAt.toISOString().split("T")[0],
        diagnosis: pres.diagnosis,
        medications: medications.map((med) => ({
          name: med.name || "Unknown",
          dosage: med.dosage || "",
          frequency: med.frequency || "",
          duration: med.duration || "",
        })),
        instructions: pres.instructions,
        validUntil: pres.validUntil
          ? pres.validUntil.toISOString().split("T")[0]
          : null,
        status: prescriptionStatus,
      };
    });

    // Filter by status if provided
    const filteredPrescriptions =
      status && status !== "all"
        ? formattedPrescriptions.filter((p) => p.status === status)
        : formattedPrescriptions;

    // Calculate counts
    const activeCount = formattedPrescriptions.filter(
      (p) => p.status === "active"
    ).length;
    const expiredCount = formattedPrescriptions.filter(
      (p) => p.status === "expired"
    ).length;

    return NextResponse.json({
      prescriptions: filteredPrescriptions,
      counts: {
        active: activeCount,
        expired: expiredCount,
        total: formattedPrescriptions.length,
      },
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}
