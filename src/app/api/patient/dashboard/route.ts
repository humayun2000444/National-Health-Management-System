import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
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

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Fetch all data in parallel
    const [
      upcomingAppointments,
      totalAppointmentsThisYear,
      activePrescriptions,
      medicalRecordsCount,
      recentPrescriptions,
    ] = await Promise.all([
      // Upcoming appointments
      prisma.appointment.findMany({
        where: {
          patientId: patient.id,
          date: { gte: now },
          status: { in: ["pending", "confirmed"] },
        },
        include: {
          doctor: {
            select: {
              name: true,
              specialization: true,
              avatar: true,
            },
          },
          department: {
            select: { name: true },
          },
        },
        orderBy: { date: "asc" },
        take: 5,
      }),
      // Total visits this year
      prisma.appointment.count({
        where: {
          patientId: patient.id,
          date: { gte: startOfYear },
          status: "completed",
        },
      }),
      // Active prescriptions count
      prisma.prescription.count({
        where: {
          patientId: patient.id,
          OR: [
            { validUntil: null },
            { validUntil: { gte: now } },
          ],
        },
      }),
      // Medical records count
      prisma.medicalRecord.count({
        where: { patientId: patient.id },
      }),
      // Recent prescriptions
      prisma.prescription.findMany({
        where: {
          patientId: patient.id,
        },
        include: {
          doctor: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

    // Format upcoming appointments
    const formattedAppointments = upcomingAppointments.map((apt) => ({
      id: apt.id,
      doctor: apt.doctor.name,
      specialization: apt.doctor.specialization,
      avatar: apt.doctor.avatar,
      department: apt.department?.name,
      date: apt.date.toISOString().split("T")[0],
      time: apt.startTime,
      status: apt.status,
      type: apt.type,
    }));

    // Format prescriptions
    const formattedPrescriptions = recentPrescriptions.map((pres) => {
      // Safely handle medications that might not be an array
      let medicationsList: string[] = [];
      if (Array.isArray(pres.medications)) {
        medicationsList = pres.medications.map((m: { name?: string; dosage?: string }) =>
          `${m.name || 'Unknown'} ${m.dosage || ''}`.trim()
        );
      } else if (pres.medications && typeof pres.medications === 'object') {
        // Handle case where medications might be a single object
        const med = pres.medications as { name?: string; dosage?: string };
        if (med.name) {
          medicationsList = [`${med.name} ${med.dosage || ''}`.trim()];
        }
      }

      return {
        id: pres.id,
        doctor: pres.doctor.name,
        date: pres.createdAt.toISOString().split("T")[0],
        medications: medicationsList,
        status: pres.validUntil && pres.validUntil < now ? "expired" : "active",
      };
    });

    // Get next appointment date for description
    const nextAppointmentDate = upcomingAppointments[0]?.date;
    const nextAppointmentDesc = nextAppointmentDate
      ? new Date(nextAppointmentDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "None scheduled";

    return NextResponse.json({
      stats: {
        upcomingAppointments: upcomingAppointments.length,
        nextAppointment: nextAppointmentDesc,
        activePrescriptions,
        medicalRecords: medicalRecordsCount,
        totalVisits: totalAppointmentsThisYear,
      },
      appointments: formattedAppointments,
      prescriptions: formattedPrescriptions,
      patient: {
        name: patient.name,
        bloodGroup: patient.bloodGroup,
        allergies: patient.allergies,
        chronicConditions: patient.chronicConditions,
      },
    });
  } catch (error) {
    console.error("Error fetching patient dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
