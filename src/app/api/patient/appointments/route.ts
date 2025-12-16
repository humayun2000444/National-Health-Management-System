import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Fetch patient appointments
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

    // Build filter
    const where: Record<string, unknown> = {
      patientId: patient.id,
    };

    if (status && status !== "all") {
      if (status === "upcoming") {
        where.status = { in: ["pending", "confirmed"] };
        where.date = { gte: new Date() };
      } else {
        where.status = status;
      }
    }

    // Fetch appointments
    const appointments = await prisma.appointment.findMany({
      where,
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
      orderBy: { date: "desc" },
    });

    // Format appointments
    const formattedAppointments = appointments.map((apt) => ({
      id: apt.id,
      doctor: apt.doctor.name,
      specialization: apt.doctor.specialization,
      avatar: apt.doctor.avatar,
      department: apt.department?.name,
      date: apt.date.toISOString().split("T")[0],
      time: apt.startTime,
      endTime: apt.endTime,
      type: apt.type,
      status: apt.status,
      location: apt.department?.name || "General",
      symptoms: apt.symptoms,
      notes: apt.notes,
    }));

    // Calculate counts
    const now = new Date();
    const upcomingCount = appointments.filter(
      (a) =>
        (a.status === "pending" || a.status === "confirmed") &&
        new Date(a.date) >= now
    ).length;
    const completedCount = appointments.filter(
      (a) => a.status === "completed"
    ).length;
    const cancelledCount = appointments.filter(
      (a) => a.status === "cancelled"
    ).length;

    return NextResponse.json({
      appointments: formattedAppointments,
      counts: {
        upcoming: upcomingCount,
        completed: completedCount,
        cancelled: cancelledCount,
        total: appointments.length,
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// PATCH - Cancel appointment
export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { appointmentId, action } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Verify appointment belongs to patient
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: parseInt(appointmentId),
        patientId: patient.id,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    if (action === "cancel") {
      // Only allow cancellation of pending or confirmed appointments
      if (!["pending", "confirmed"].includes(appointment.status)) {
        return NextResponse.json(
          { error: "Cannot cancel this appointment" },
          { status: 400 }
        );
      }

      await prisma.appointment.update({
        where: { id: parseInt(appointmentId) },
        data: { status: "cancelled" },
      });

      return NextResponse.json({
        message: "Appointment cancelled successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
