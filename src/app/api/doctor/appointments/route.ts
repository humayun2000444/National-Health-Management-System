import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const dateFilter = searchParams.get("date") || "all";
    const search = searchParams.get("search");

    // Build date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    let dateCondition = {};
    if (dateFilter === "today") {
      dateCondition = { date: { gte: today, lt: tomorrow } };
    } else if (dateFilter === "tomorrow") {
      dateCondition = { date: { gte: tomorrow, lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) } };
    } else if (dateFilter === "week") {
      dateCondition = { date: { gte: today, lt: weekEnd } };
    }

    // Get appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        ...(status && { status }),
        ...dateCondition,
        ...(search && {
          patient: {
            name: { contains: search },
          },
        }),
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            avatar: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    // Get stats
    const [todayCount, pendingCount, confirmedCount, completedCount] = await Promise.all([
      prisma.appointment.count({
        where: { doctorId, date: { gte: today, lt: tomorrow } },
      }),
      prisma.appointment.count({
        where: { doctorId, status: "pending", date: { gte: today } },
      }),
      prisma.appointment.count({
        where: { doctorId, status: "confirmed", date: { gte: today } },
      }),
      prisma.appointment.count({
        where: { doctorId, status: "completed", date: { gte: today, lt: tomorrow } },
      }),
    ]);

    // Format appointments
    const formattedAppointments = appointments.map((apt) => {
      // Calculate age from date of birth
      let age = null;
      if (apt.patient.dateOfBirth) {
        const birthDate = new Date(apt.patient.dateOfBirth);
        const ageDiff = Date.now() - birthDate.getTime();
        age = Math.floor(ageDiff / (365.25 * 24 * 60 * 60 * 1000));
      }

      return {
        id: apt.id,
        patient: apt.patient.name,
        patientId: apt.patient.id,
        patientAvatar: apt.patient.avatar,
        age,
        gender: apt.patient.gender,
        phone: apt.patient.phone,
        date: apt.date,
        time: apt.startTime,
        endTime: apt.endTime,
        type: apt.type,
        status: apt.status,
        symptoms: apt.symptoms,
        notes: apt.notes,
        diagnosis: apt.diagnosis,
        department: apt.department?.name,
      };
    });

    return NextResponse.json({
      appointments: formattedAppointments,
      stats: {
        today: todayCount,
        pending: pendingCount,
        confirmed: confirmedCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    console.error("Doctor appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);
    const body = await request.json();
    const { appointmentId, status, diagnosis, notes } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Verify the appointment belongs to this doctor
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(status && { status }),
        ...(diagnosis && { diagnosis }),
        ...(notes && { notes }),
      },
    });

    return NextResponse.json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
