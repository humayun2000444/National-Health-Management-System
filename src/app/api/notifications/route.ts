import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List notifications for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const userType = session.user.type;
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = searchParams.get("limit");

    const whereClause: Record<string, unknown> = {
      userId,
      userType,
    };

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : 50,
    });

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        userType,
        isRead: false,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Notifications list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST - Create notification (internal use)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Only allow authenticated users to create notifications
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, userType, type, title, message, link, metadata } = body;

    if (!userId || !userType || !type || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hospitalId = session.user.hospitalId;

    const notification = await prisma.notification.create({
      data: {
        userId: parseInt(userId),
        userType,
        hospitalId,
        type,
        title,
        message,
        link,
        metadata: metadata || null,
      },
    });

    return NextResponse.json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const userType = session.user.type;
    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: {
          userId,
          userType,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return NextResponse.json({
        message: "All notifications marked as read",
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Mark single notification as read
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(notificationId) },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.userId !== userId || notification.userType !== userType) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.notification.update({
      where: { id: parseInt(notificationId) },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE - Delete notification(s)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const userType = session.user.type;
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");
    const deleteAll = searchParams.get("all") === "true";

    if (deleteAll) {
      // Delete all notifications for user
      await prisma.notification.deleteMany({
        where: {
          userId,
          userType,
        },
      });

      return NextResponse.json({
        message: "All notifications deleted",
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(notificationId) },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.userId !== userId || notification.userType !== userType) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.notification.delete({
      where: { id: parseInt(notificationId) },
    });

    return NextResponse.json({
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
