import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Fetch doctors and departments for booking
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
    const departmentId = searchParams.get("departmentId");
    const search = searchParams.get("search");

    // Build doctor filter
    const doctorWhere: Record<string, unknown> = {
      hospitalId: patient.hospitalId,
      isActive: true,
    };

    if (departmentId) {
      doctorWhere.departmentId = parseInt(departmentId);
    }

    if (search) {
      doctorWhere.OR = [
        { name: { contains: search } },
        { specialization: { contains: search } },
      ];
    }

    // Fetch doctors and departments in parallel
    const [doctors, departments] = await Promise.all([
      prisma.doctor.findMany({
        where: doctorWhere,
        include: {
          department: {
            select: { id: true, name: true },
          },
          _count: {
            select: { appointments: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.department.findMany({
        where: {
          hospitalId: patient.hospitalId,
          isActive: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    // Format doctors with available slots
    const formattedDoctors = doctors.map((doc) => {
      // Parse available days
      let availableDays: string[] = [];
      try {
        availableDays = doc.availableDays ? JSON.parse(doc.availableDays) : [];
      } catch {
        availableDays = [];
      }

      // Generate time slots based on doctor's schedule
      const slots = generateTimeSlots(
        doc.startTime || "09:00",
        doc.endTime || "17:00",
        doc.slotDuration
      );

      return {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        qualification: doc.qualification,
        experience: doc.experience,
        avatar: doc.avatar,
        consultationFee: doc.consultationFee ? Number(doc.consultationFee) : 0,
        department: doc.department,
        availableDays,
        availableSlots: slots,
        rating: 4.5 + Math.random() * 0.5, // Placeholder rating
        totalAppointments: doc._count.appointments,
      };
    });

    // Format departments
    const formattedDepartments = [
      { value: "", label: "All Departments" },
      ...departments.map((dept) => ({
        value: dept.id.toString(),
        label: dept.name,
      })),
    ];

    return NextResponse.json({
      doctors: formattedDoctors,
      departments: formattedDepartments,
    });
  } catch (error) {
    console.error("Error fetching booking data:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking data" },
      { status: 500 }
    );
  }
}

// POST - Create new appointment
export async function POST(request: NextRequest) {
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
    const { doctorId, date, startTime, type, symptoms } = body;

    if (!doctorId || !date || !startTime) {
      return NextResponse.json(
        { error: "Doctor, date, and time are required" },
        { status: 400 }
      );
    }

    // Get doctor info
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) },
      include: { department: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    if (doctor.hospitalId !== patient.hospitalId) {
      return NextResponse.json(
        { error: "Doctor not available at your hospital" },
        { status: 400 }
      );
    }

    // Check for existing appointment at same time
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: parseInt(doctorId),
        date: new Date(date),
        startTime,
        status: { in: ["pending", "confirmed"] },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 400 }
      );
    }

    // Calculate end time based on slot duration
    const endTime = calculateEndTime(startTime, doctor.slotDuration);

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: parseInt(doctorId),
        departmentId: doctor.departmentId!,
        hospitalId: patient.hospitalId,
        date: new Date(date),
        startTime,
        endTime,
        type: type || "consultation",
        symptoms: symptoms || null,
        status: "pending",
      },
      include: {
        doctor: {
          select: { name: true, specialization: true },
        },
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({
      message: "Appointment booked successfully",
      appointment: {
        id: appointment.id,
        doctor: appointment.doctor.name,
        department: appointment.department?.name,
        date: appointment.date.toISOString().split("T")[0],
        time: appointment.startTime,
        status: appointment.status,
      },
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}

// Helper function to generate time slots
function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const hour12 = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
    const ampm = currentHour >= 12 ? "PM" : "AM";
    const timeStr = `${hour12.toString().padStart(2, "0")}:${currentMin
      .toString()
      .padStart(2, "0")} ${ampm}`;
    slots.push(timeStr);

    currentMin += duration;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return slots;
}

// Helper function to calculate end time
function calculateEndTime(startTime: string, durationMinutes: number): string {
  // Parse time like "09:00 AM" or "02:30 PM"
  const match = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return startTime;

  let hour = parseInt(match[1]);
  const min = parseInt(match[2]);
  const ampm = match[3].toUpperCase();

  // Convert to 24-hour format
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  // Add duration
  let endMin = min + durationMinutes;
  let endHour = hour + Math.floor(endMin / 60);
  endMin = endMin % 60;

  // Convert back to 12-hour format
  const endAmPm = endHour >= 12 ? "PM" : "AM";
  const endHour12 = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour;

  return `${endHour12.toString().padStart(2, "0")}:${endMin
    .toString()
    .padStart(2, "0")} ${endAmPm}`;
}
