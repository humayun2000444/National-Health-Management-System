import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch comprehensive analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.type !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const hospitalId = session.user.hospitalId;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // week, month, quarter, year

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "quarter":
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default: // month
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Parallel fetch all analytics data
    const [
      appointmentStats,
      patientStats,
      revenueStats,
      departmentStats,
      doctorPerformance,
      dailyTrends,
      patientDemographics,
    ] = await Promise.all([
      // Appointment statistics
      prisma.appointment.groupBy({
        by: ["status"],
        where: {
          hospitalId,
          date: { gte: startDate },
        },
        _count: true,
      }),

      // Patient growth
      prisma.patient.count({
        where: {
          hospitalId,
          createdAt: { gte: startDate },
        },
      }),

      // Revenue stats
      prisma.invoice.aggregate({
        where: {
          hospitalId,
          createdAt: { gte: startDate },
        },
        _sum: {
          total: true,
          paidAmount: true,
        },
        _count: true,
      }),

      // Department performance
      prisma.appointment.groupBy({
        by: ["departmentId"],
        where: {
          hospitalId,
          date: { gte: startDate },
        },
        _count: true,
      }),

      // Doctor performance (top 10)
      prisma.appointment.groupBy({
        by: ["doctorId"],
        where: {
          hospitalId,
          date: { gte: startDate },
          status: "completed",
        },
        _count: true,
        orderBy: { _count: { doctorId: "desc" } },
        take: 10,
      }),

      // Daily appointment trends (last 30 days)
      prisma.$queryRaw`
        SELECT
          DATE(date) as day,
          COUNT(*) as appointments,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
        FROM appointments
        WHERE hospital_id = ${hospitalId}
        AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(date)
        ORDER BY DATE(date)
      `,

      // Patient demographics
      prisma.patient.groupBy({
        by: ["gender"],
        where: { hospitalId },
        _count: true,
      }),
    ]);

    // Get department names
    const departments = await prisma.department.findMany({
      where: { hospitalId },
      select: { id: true, name: true },
    });

    const departmentMap = Object.fromEntries(
      departments.map((d) => [d.id, d.name])
    );

    // Get doctor names for top performers
    const doctorIds = doctorPerformance.map((d) => d.doctorId);
    const doctors = await prisma.doctor.findMany({
      where: { id: { in: doctorIds } },
      select: { id: true, name: true, specialization: true },
    });

    const doctorMap = Object.fromEntries(
      doctors.map((d) => [d.id, { name: d.name, specialization: d.specialization }])
    );

    // Calculate appointment status breakdown
    const appointmentBreakdown = appointmentStats.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalAppointments = Object.values(appointmentBreakdown).reduce(
      (a, b) => a + b,
      0
    );

    // Calculate completion rate
    const completionRate = totalAppointments > 0
      ? Math.round((appointmentBreakdown.completed || 0) / totalAppointments * 100)
      : 0;

    // Calculate cancellation rate
    const cancellationRate = totalAppointments > 0
      ? Math.round((appointmentBreakdown.cancelled || 0) / totalAppointments * 100)
      : 0;

    // Format daily trends
    const formattedTrends = (dailyTrends as Array<{
      day: Date;
      appointments: bigint;
      completed: bigint;
      cancelled: bigint;
    }>).map((d) => ({
      day: new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      appointments: Number(d.appointments),
      completed: Number(d.completed),
      cancelled: Number(d.cancelled),
    }));

    // Format department stats
    const formattedDepartments = departmentStats.map((d) => ({
      name: departmentMap[d.departmentId] || "Unknown",
      appointments: d._count,
    })).sort((a, b) => b.appointments - a.appointments);

    // Format doctor performance
    const formattedDoctors = doctorPerformance.map((d) => ({
      id: d.doctorId,
      name: doctorMap[d.doctorId]?.name || "Unknown",
      specialization: doctorMap[d.doctorId]?.specialization || "N/A",
      completedAppointments: d._count,
    }));

    // Format patient demographics
    const demographics = patientDemographics.map((d) => ({
      gender: d.gender || "Not Specified",
      count: d._count,
    }));

    // Calculate revenue metrics
    const totalRevenue = Number(revenueStats._sum.total || 0);
    const collectedRevenue = Number(revenueStats._sum.paidAmount || 0);
    const pendingRevenue = totalRevenue - collectedRevenue;
    const collectionRate = totalRevenue > 0
      ? Math.round((collectedRevenue / totalRevenue) * 100)
      : 0;

    return NextResponse.json({
      summary: {
        totalAppointments,
        newPatients: patientStats,
        totalRevenue,
        collectedRevenue,
        pendingRevenue,
        collectionRate,
        completionRate,
        cancellationRate,
        totalInvoices: revenueStats._count,
      },
      appointmentBreakdown,
      dailyTrends: formattedTrends,
      departmentPerformance: formattedDepartments,
      topDoctors: formattedDoctors,
      patientDemographics: demographics,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
