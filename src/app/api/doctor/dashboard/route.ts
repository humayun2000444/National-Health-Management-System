import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch stats in parallel
    const [
      todayAppointments,
      totalPatients,
      pendingReports,
      allAppointments,
      recentPatients,
    ] = await Promise.all([
      // Today's appointments count
      prisma.appointment.count({
        where: {
          doctorId,
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      // Total unique patients
      prisma.appointment.groupBy({
        by: ["patientId"],
        where: {
          doctorId,
        },
      }),
      // Pending records (prescriptions without medical record follow-up)
      prisma.prescription.count({
        where: {
          doctorId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      // Today's appointments with details
      prisma.appointment.findMany({
        where: {
          doctorId,
          date: {
            gte: today,
            lt: tomorrow,
          },
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
          startTime: "asc",
        },
        take: 10,
      }),
      // Recent patients (patients with recent appointments)
      prisma.appointment.findMany({
        where: {
          doctorId,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              avatar: true,
              chronicConditions: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        distinct: ["patientId"],
        take: 5,
      }),
    ]);

    // Count pending appointments for today
    const pendingCount = allAppointments.filter(
      (apt) => apt.status === "pending"
    ).length;

    // Format today's appointments
    const formattedAppointments = allAppointments.map((apt) => ({
      id: apt.id,
      patient: apt.patient.name,
      patientAvatar: apt.patient.avatar,
      time: apt.startTime,
      type: apt.type,
      status: apt.status,
      symptoms: apt.symptoms,
    }));

    // Format recent patients with last visit info
    const formattedPatients = recentPatients.map((apt) => ({
      id: apt.patient.id,
      name: apt.patient.name,
      avatar: apt.patient.avatar,
      lastVisit: apt.date,
      condition: apt.patient.chronicConditions || apt.diagnosis || "General Checkup",
      status: apt.status === "completed" ? "Completed" : "Ongoing",
    }));

    return NextResponse.json({
      stats: {
        todayAppointments,
        pendingConfirmation: pendingCount,
        totalPatients: totalPatients.length,
        pendingReports: Math.min(pendingReports, 10),
      },
      todaySchedule: formattedAppointments,
      recentPatients: formattedPatients,
    });
  } catch (error) {
    console.error("Doctor dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
