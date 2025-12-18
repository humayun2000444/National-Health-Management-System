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
    const search = searchParams.get("search");

    // Get all unique patients who have had appointments with this doctor
    const patientAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        ...(search && {
          OR: [
            { patient: { name: { contains: search } } },
            { diagnosis: { contains: search } },
          ],
        }),
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            dateOfBirth: true,
            gender: true,
            bloodGroup: true,
            address: true,
            allergies: true,
            chronicConditions: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Group appointments by patient and get latest info
    const patientMap = new Map();

    for (const apt of patientAppointments) {
      const patientId = apt.patient.id;

      if (!patientMap.has(patientId)) {
        // Calculate age
        let age = null;
        if (apt.patient.dateOfBirth) {
          const birthDate = new Date(apt.patient.dateOfBirth);
          const ageDiff = Date.now() - birthDate.getTime();
          age = Math.floor(ageDiff / (365.25 * 24 * 60 * 60 * 1000));
        }

        patientMap.set(patientId, {
          id: apt.patient.id,
          name: apt.patient.name,
          email: apt.patient.email,
          phone: apt.patient.phone,
          avatar: apt.patient.avatar,
          age,
          gender: apt.patient.gender,
          bloodGroup: apt.patient.bloodGroup,
          address: apt.patient.address,
          allergies: apt.patient.allergies,
          chronicConditions: apt.patient.chronicConditions,
          condition: apt.diagnosis || apt.patient.chronicConditions || "General",
          lastVisit: apt.date,
          nextAppointment: null,
          totalVisits: 1,
          status: apt.status === "completed" ? "Stable" : "Ongoing",
        });
      } else {
        // Update visit count
        const existing = patientMap.get(patientId);
        existing.totalVisits++;

        // Check for future appointments
        if (new Date(apt.date) > new Date() && !existing.nextAppointment) {
          existing.nextAppointment = apt.date;
        }
      }
    }

    const patients = Array.from(patientMap.values());

    // Get stats
    const totalPatients = patients.length;
    const ongoingPatients = patients.filter((p) => p.status === "Ongoing").length;
    const stablePatients = patients.filter((p) => p.status === "Stable").length;

    return NextResponse.json({
      patients,
      stats: {
        total: totalPatients,
        ongoing: ongoingPatients,
        stable: stablePatients,
      },
    });
  } catch (error) {
    console.error("Doctor patients error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
