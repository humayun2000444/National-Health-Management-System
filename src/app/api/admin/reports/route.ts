import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    // Get period from query params
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();
    let previousEndDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        previousStartDate.setDate(now.getDate() - 14);
        previousEndDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        previousStartDate.setDate(now.getDate() - 60);
        previousEndDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        previousStartDate.setDate(now.getDate() - 180);
        previousEndDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        previousStartDate.setFullYear(now.getFullYear() - 2);
        previousEndDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
        previousStartDate.setDate(now.getDate() - 60);
        previousEndDate.setDate(now.getDate() - 30);
    }

    // Fetch all data in parallel
    const [
      // Current period stats
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      pendingAppointments,
      confirmedAppointments,
      newPatients,
      // Previous period stats (for comparison)
      previousAppointments,
      previousPatients,
      // Department performance
      departments,
      // Top doctors
      topDoctors,
      // Monthly data for charts
      allAppointments,
    ] = await Promise.all([
      // Total appointments in period
      prisma.appointment.count({
        where: {
          hospitalId,
          createdAt: { gte: startDate },
        },
      }),
      // Completed appointments
      prisma.appointment.count({
        where: {
          hospitalId,
          status: "completed",
          createdAt: { gte: startDate },
        },
      }),
      // Cancelled appointments
      prisma.appointment.count({
        where: {
          hospitalId,
          status: "cancelled",
          createdAt: { gte: startDate },
        },
      }),
      // Pending appointments
      prisma.appointment.count({
        where: {
          hospitalId,
          status: "pending",
          createdAt: { gte: startDate },
        },
      }),
      // Confirmed appointments
      prisma.appointment.count({
        where: {
          hospitalId,
          status: "confirmed",
          createdAt: { gte: startDate },
        },
      }),
      // New patients in period
      prisma.patient.count({
        where: {
          hospitalId,
          createdAt: { gte: startDate },
        },
      }),
      // Previous period appointments
      prisma.appointment.count({
        where: {
          hospitalId,
          createdAt: { gte: previousStartDate, lt: previousEndDate },
        },
      }),
      // Previous period patients
      prisma.patient.count({
        where: {
          hospitalId,
          createdAt: { gte: previousStartDate, lt: previousEndDate },
        },
      }),
      // Departments with appointment counts
      prisma.department.findMany({
        where: { hospitalId },
        include: {
          _count: {
            select: {
              appointments: {
                where: {
                  createdAt: { gte: startDate },
                },
              },
            },
          },
        },
      }),
      // Top doctors by appointments
      prisma.doctor.findMany({
        where: { hospitalId },
        include: {
          department: true,
          _count: {
            select: {
              appointments: {
                where: {
                  createdAt: { gte: startDate },
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
      }),
      // All appointments for monthly breakdown
      prisma.appointment.findMany({
        where: {
          hospitalId,
          createdAt: { gte: startDate },
        },
        include: {
          doctor: true,
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Calculate revenue from completed appointments
    const totalRevenue = allAppointments
      .filter((apt) => apt.status === "completed")
      .reduce((sum, apt) => sum + (Number(apt.doctor?.consultationFee) || 0), 0);

    // Calculate previous period revenue (estimate based on ratio)
    const previousRevenue = previousAppointments > 0
      ? (totalRevenue / totalAppointments) * previousAppointments
      : 0;

    // Calculate percentage changes
    const appointmentChange = previousAppointments > 0
      ? ((totalAppointments - previousAppointments) / previousAppointments) * 100
      : 0;
    const patientChange = previousPatients > 0
      ? ((newPatients - previousPatients) / previousPatients) * 100
      : 0;
    const revenueChange = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    // Calculate completion rate
    const completionRate = totalAppointments > 0
      ? (completedAppointments / totalAppointments) * 100
      : 0;

    // Prepare appointment status data for pie chart
    const appointmentStatus = [
      { name: "Completed", value: completedAppointments, color: "#10b981" },
      { name: "Confirmed", value: confirmedAppointments, color: "#2563eb" },
      { name: "Pending", value: pendingAppointments, color: "#f59e0b" },
      { name: "Cancelled", value: cancelledAppointments, color: "#ef4444" },
    ].filter((item) => item.value > 0);

    // Prepare department performance data
    const departmentPerformance = departments
      .map((dept) => ({
        name: dept.name,
        appointments: dept._count.appointments,
      }))
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 5);

    // Prepare top doctors data
    const doctorPerformance = topDoctors.map((doc) => ({
      name: doc.name,
      patients: doc._count.appointments,
      department: doc.department?.name || "General",
    }));

    // Generate monthly data based on period
    const monthlyData = generateMonthlyData(allAppointments, period);

    // Calculate insights
    const insights = calculateInsights(allAppointments);

    return NextResponse.json({
      summary: {
        totalAppointments,
        appointmentChange: appointmentChange.toFixed(1),
        newPatients,
        patientChange: patientChange.toFixed(1),
        totalRevenue,
        revenueChange: revenueChange.toFixed(1),
        completionRate: completionRate.toFixed(1),
      },
      appointmentStatus,
      departmentPerformance,
      doctorPerformance,
      monthlyData,
      insights,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

function generateMonthlyData(
  appointments: Array<{ createdAt: Date; status: string; doctor: { consultationFee: unknown } | null }>,
  period: string
) {
  const data: Record<string, { appointments: number; patients: number; revenue: number }> = {};

  // Determine grouping based on period
  const isYearly = period === "1y";

  appointments.forEach((apt) => {
    const date = new Date(apt.createdAt);
    const key = isYearly
      ? date.toLocaleString("default", { month: "short" })
      : `${date.getMonth() + 1}/${date.getDate()}`;

    if (!data[key]) {
      data[key] = { appointments: 0, patients: 0, revenue: 0 };
    }

    data[key].appointments++;
    if (apt.status === "completed") {
      data[key].revenue += Number(apt.doctor?.consultationFee) || 0;
    }
  });

  // Convert to array and limit data points
  const result = Object.entries(data).map(([name, values]) => ({
    name,
    ...values,
  }));

  // Limit to reasonable number of points
  if (result.length > 12) {
    const step = Math.ceil(result.length / 12);
    return result.filter((_, index) => index % step === 0);
  }

  return result;
}

function calculateInsights(
  appointments: Array<{ createdAt: Date; startTime: string }>
) {
  if (appointments.length === 0) {
    return {
      peakHours: "N/A",
      busiestDay: "N/A",
      avgAppointmentsPerDay: 0,
    };
  }

  // Calculate peak hours
  const hourCounts: Record<number, number> = {};
  const dayCounts: Record<string, number> = {};
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  appointments.forEach((apt) => {
    // Extract hour from startTime (format: "HH:MM")
    const hour = parseInt(apt.startTime?.split(":")[0] || "9");
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;

    // Count by day of week
    const dayOfWeek = new Date(apt.createdAt).getDay();
    const dayName = dayNames[dayOfWeek];
    dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
  });

  // Find peak hour
  let peakHour = 9;
  let maxCount = 0;
  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = parseInt(hour);
    }
  });

  // Find busiest day
  let busiestDay = "Monday";
  let maxDayCount = 0;
  Object.entries(dayCounts).forEach(([day, count]) => {
    if (count > maxDayCount) {
      maxDayCount = count;
      busiestDay = day;
    }
  });

  // Format peak hours
  const peakStart = peakHour;
  const peakEnd = peakHour + 2;
  const formatHour = (h: number) => {
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour12} ${suffix}`;
  };

  return {
    peakHours: `${formatHour(peakStart)} - ${formatHour(peakEnd)}`,
    busiestDay,
    avgAppointmentsPerDay: Math.round(appointments.length / 7),
  };
}
