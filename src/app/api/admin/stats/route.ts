import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email! },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const hospitalId = admin.hospitalId;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get this month's date range
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Get counts
    const [
      totalPatients,
      totalDoctors,
      todayAppointments,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      departments,
      recentAppointments,
      weeklyData,
    ] = await Promise.all([
      // Total patients
      prisma.patient.count({
        where: { hospitalId },
      }),

      // Total doctors
      prisma.doctor.count({
        where: { hospitalId },
      }),

      // Today's appointments
      prisma.appointment.count({
        where: {
          hospitalId,
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Total appointments this month
      prisma.appointment.count({
        where: {
          hospitalId,
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),

      // Pending appointments
      prisma.appointment.count({
        where: {
          hospitalId,
          status: "pending",
        },
      }),

      // Completed appointments this month
      prisma.appointment.count({
        where: {
          hospitalId,
          status: "completed",
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),

      // Departments count
      prisma.department.count({
        where: { hospitalId },
      }),

      // Recent appointments
      prisma.appointment.findMany({
        where: { hospitalId },
        include: {
          patient: true,
          doctor: {
            include: {
              department: true,
            },
          },
        },
        orderBy: { date: "desc" },
        take: 5,
      }),

      // Weekly appointments data (last 7 days)
      getWeeklyAppointments(hospitalId),
    ]);

    // Calculate monthly revenue (sum of completed appointment fees)
    const completedAppointmentsWithFees = await prisma.appointment.findMany({
      where: {
        hospitalId,
        status: "completed",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        doctor: true,
      },
    });

    const monthlyRevenue = completedAppointmentsWithFees.reduce(
      (sum, apt) => sum + (apt.doctor?.consultationFee || 0),
      0
    );

    // Get top doctors by appointments
    const topDoctors = await prisma.doctor.findMany({
      where: { hospitalId },
      include: {
        department: true,
        _count: {
          select: {
            appointments: {
              where: {
                date: {
                  gte: startOfMonth,
                  lte: endOfMonth,
                },
              },
            },
          },
        },
      },
      orderBy: {
        appointments: {
          _count: "desc",
        },
      },
      take: 5,
    });

    // Get appointments by department
    const appointmentsByDepartment = await prisma.department.findMany({
      where: { hospitalId },
      include: {
        doctors: {
          include: {
            _count: {
              select: {
                appointments: {
                  where: {
                    date: {
                      gte: startOfMonth,
                      lte: endOfMonth,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const departmentStats = appointmentsByDepartment.map((dept) => ({
      name: dept.name,
      appointments: dept.doctors.reduce(
        (sum, doc) => sum + doc._count.appointments,
        0
      ),
    }));

    return NextResponse.json({
      stats: {
        totalPatients,
        totalDoctors,
        todayAppointments,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        departments,
        monthlyRevenue,
      },
      recentAppointments,
      topDoctors: topDoctors.map((doc) => ({
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        department: doc.department?.name,
        appointments: doc._count.appointments,
        image: doc.image,
      })),
      weeklyData,
      departmentStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

async function getWeeklyAppointments(hospitalId: string) {
  const days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = await prisma.appointment.count({
      where: {
        hospitalId,
        date: {
          gte: date,
          lt: nextDate,
        },
      },
    });

    days.push({
      day: dayNames[date.getDay()],
      appointments: count,
    });
  }

  return days;
}
