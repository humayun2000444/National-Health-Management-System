import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);

    // Get doctor's current schedule settings
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: {
        availableDays: true,
        startTime: true,
        endTime: true,
        slotDuration: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Parse available days (stored as JSON string or text)
    let schedule: Record<string, { enabled: boolean; start: string; end: string }> = {
      Monday: { enabled: true, start: "09:00", end: "17:00" },
      Tuesday: { enabled: true, start: "09:00", end: "17:00" },
      Wednesday: { enabled: true, start: "09:00", end: "17:00" },
      Thursday: { enabled: true, start: "09:00", end: "17:00" },
      Friday: { enabled: true, start: "09:00", end: "15:00" },
      Saturday: { enabled: false, start: "10:00", end: "14:00" },
      Sunday: { enabled: false, start: "10:00", end: "14:00" },
    };

    if (doctor.availableDays) {
      try {
        const parsed = JSON.parse(doctor.availableDays);
        if (typeof parsed === "object") {
          schedule = parsed;
        }
      } catch {
        // If it's a comma-separated list of days
        const days = doctor.availableDays.split(",").map((d) => d.trim());
        Object.keys(schedule).forEach((day) => {
          schedule[day].enabled = days.includes(day);
          if (doctor.startTime) schedule[day].start = doctor.startTime;
          if (doctor.endTime) schedule[day].end = doctor.endTime;
        });
      }
    }

    // Calculate summary
    const workingDays = Object.values(schedule).filter((d) => d.enabled).length;
    const totalHours = Object.values(schedule).reduce((acc, day) => {
      if (!day.enabled) return acc;
      const [startH, startM] = day.start.split(":").map(Number);
      const [endH, endM] = day.end.split(":").map(Number);
      const hours = (endH + endM / 60) - (startH + startM / 60);
      return acc + hours;
    }, 0);

    const slotDuration = doctor.slotDuration || 30;
    const avgSlotsPerDay = Math.floor((totalHours / workingDays) * (60 / slotDuration)) || 0;

    return NextResponse.json({
      schedule,
      slotDuration,
      summary: {
        workingDays,
        totalHours: Math.round(totalHours),
        slotsPerDay: avgSlotsPerDay,
      },
    });
  } catch (error) {
    console.error("Doctor schedule error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);
    const body = await request.json();
    const { schedule, slotDuration } = body;

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule is required" },
        { status: 400 }
      );
    }

    // Update doctor's schedule
    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        availableDays: JSON.stringify(schedule),
        slotDuration: slotDuration || 30,
      },
    });

    return NextResponse.json({
      message: "Schedule updated successfully",
    });
  } catch (error) {
    console.error("Update schedule error:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}
