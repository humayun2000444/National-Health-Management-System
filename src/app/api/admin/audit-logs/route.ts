import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List audit logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hospitalId = session.user.hospitalId;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const resource = searchParams.get("resource");
    const userId = searchParams.get("userId");
    const userType = searchParams.get("userType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {
      hospitalId,
    };

    if (action && action !== "all") {
      whereClause.action = action;
    }

    if (resource && resource !== "all") {
      whereClause.resource = resource;
    }

    if (userId) {
      whereClause.userId = parseInt(userId);
    }

    if (userType && userType !== "all") {
      whereClause.userType = userType;
    }

    if (startDate) {
      whereClause.createdAt = {
        ...(whereClause.createdAt as Record<string, unknown> || {}),
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      whereClause.createdAt = {
        ...(whereClause.createdAt as Record<string, unknown> || {}),
        lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    if (search) {
      whereClause.OR = [
        { description: { contains: search } },
        { resourceId: { contains: search } },
        { ipAddress: { contains: search } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where: whereClause }),
    ]);

    // Get stats for dashboard
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Promise.all([
      // Total logs today
      prisma.auditLog.count({
        where: {
          hospitalId,
          createdAt: { gte: today },
        },
      }),
      // Login attempts today
      prisma.auditLog.count({
        where: {
          hospitalId,
          action: "login",
          createdAt: { gte: today },
        },
      }),
      // Access denied today
      prisma.auditLog.count({
        where: {
          hospitalId,
          action: "access_denied",
          createdAt: { gte: today },
        },
      }),
      // Actions by type
      prisma.auditLog.groupBy({
        by: ["action"],
        where: { hospitalId },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        todayTotal: stats[0],
        todayLogins: stats[1],
        todayAccessDenied: stats[2],
        byAction: stats[3].reduce((acc, item) => {
          acc[item.action] = item._count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error("Audit logs list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}

// DELETE - Clear old audit logs (admin only, for maintenance)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hospitalId = session.user.hospitalId;
    const { searchParams } = new URL(request.url);
    const olderThanDays = parseInt(searchParams.get("olderThanDays") || "365");

    if (olderThanDays < 90) {
      return NextResponse.json(
        { error: "Cannot delete logs newer than 90 days for compliance" },
        { status: 400 }
      );
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await prisma.auditLog.deleteMany({
      where: {
        hospitalId,
        createdAt: { lt: cutoffDate },
      },
    });

    return NextResponse.json({
      message: `Deleted ${result.count} audit logs older than ${olderThanDays} days`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Delete audit logs error:", error);
    return NextResponse.json(
      { error: "Failed to delete audit logs" },
      { status: 500 }
    );
  }
}
