import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List vital signs for patients
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    const whereClause: Record<string, unknown> = {
      recordedById: doctorId,
    };

    if (patientId) {
      whereClause.patientId = parseInt(patientId);
    }

    const vitals = await prisma.vitalSign.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            dateOfBirth: true,
            gender: true,
          },
        },
      },
      orderBy: { recordedAt: "desc" },
      take: 100,
    });

    // Get unique patients count
    const uniquePatients = new Set(vitals.map((v) => v.patientId)).size;

    return NextResponse.json({
      vitals: vitals.map((v) => ({
        ...v,
        temperature: v.temperature ? Number(v.temperature) : null,
        weight: v.weight ? Number(v.weight) : null,
        height: v.height ? Number(v.height) : null,
      })),
      stats: {
        totalRecords: vitals.length,
        uniquePatients,
      },
    });
  } catch (error) {
    console.error("Vitals list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vital signs" },
      { status: 500 }
    );
  }
}

// POST - Record vital signs
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);
    const hospitalId = session.user.hospitalId;
    const body = await request.json();

    const {
      patientId,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      temperature,
      respiratoryRate,
      oxygenSaturation,
      weight,
      height,
      bloodGlucose,
      painLevel,
      notes,
      appointmentId,
    } = body;

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    // At least one vital sign should be provided
    if (
      !bloodPressureSystolic &&
      !heartRate &&
      !temperature &&
      !respiratoryRate &&
      !oxygenSaturation &&
      !weight &&
      !bloodGlucose
    ) {
      return NextResponse.json(
        { error: "At least one vital sign measurement is required" },
        { status: 400 }
      );
    }

    const vitalSign = await prisma.vitalSign.create({
      data: {
        patientId: parseInt(patientId),
        recordedById: doctorId,
        hospitalId,
        bloodPressureSystolic: bloodPressureSystolic
          ? parseInt(bloodPressureSystolic)
          : null,
        bloodPressureDiastolic: bloodPressureDiastolic
          ? parseInt(bloodPressureDiastolic)
          : null,
        heartRate: heartRate ? parseInt(heartRate) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        respiratoryRate: respiratoryRate ? parseInt(respiratoryRate) : null,
        oxygenSaturation: oxygenSaturation ? parseInt(oxygenSaturation) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        bloodGlucose: bloodGlucose ? parseInt(bloodGlucose) : null,
        painLevel: painLevel ? parseInt(painLevel) : null,
        notes,
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
      },
      include: {
        patient: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      message: "Vital signs recorded successfully",
      vitalSign: {
        ...vitalSign,
        temperature: vitalSign.temperature ? Number(vitalSign.temperature) : null,
        weight: vitalSign.weight ? Number(vitalSign.weight) : null,
        height: vitalSign.height ? Number(vitalSign.height) : null,
      },
    });
  } catch (error) {
    console.error("Record vitals error:", error);
    return NextResponse.json(
      { error: "Failed to record vital signs" },
      { status: 500 }
    );
  }
}

// PUT - Update vital signs record
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Vital sign record ID is required" },
        { status: 400 }
      );
    }

    const vitalSign = await prisma.vitalSign.findUnique({
      where: { id: parseInt(id) },
    });

    if (!vitalSign) {
      return NextResponse.json(
        { error: "Vital sign record not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (data.bloodPressureSystolic !== undefined)
      updateData.bloodPressureSystolic = data.bloodPressureSystolic
        ? parseInt(data.bloodPressureSystolic)
        : null;
    if (data.bloodPressureDiastolic !== undefined)
      updateData.bloodPressureDiastolic = data.bloodPressureDiastolic
        ? parseInt(data.bloodPressureDiastolic)
        : null;
    if (data.heartRate !== undefined)
      updateData.heartRate = data.heartRate ? parseInt(data.heartRate) : null;
    if (data.temperature !== undefined)
      updateData.temperature = data.temperature
        ? parseFloat(data.temperature)
        : null;
    if (data.respiratoryRate !== undefined)
      updateData.respiratoryRate = data.respiratoryRate
        ? parseInt(data.respiratoryRate)
        : null;
    if (data.oxygenSaturation !== undefined)
      updateData.oxygenSaturation = data.oxygenSaturation
        ? parseInt(data.oxygenSaturation)
        : null;
    if (data.weight !== undefined)
      updateData.weight = data.weight ? parseFloat(data.weight) : null;
    if (data.height !== undefined)
      updateData.height = data.height ? parseFloat(data.height) : null;
    if (data.bloodGlucose !== undefined)
      updateData.bloodGlucose = data.bloodGlucose
        ? parseInt(data.bloodGlucose)
        : null;
    if (data.painLevel !== undefined)
      updateData.painLevel = data.painLevel ? parseInt(data.painLevel) : null;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const updated = await prisma.vitalSign.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        patient: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      message: "Vital signs updated successfully",
      vitalSign: {
        ...updated,
        temperature: updated.temperature ? Number(updated.temperature) : null,
        weight: updated.weight ? Number(updated.weight) : null,
        height: updated.height ? Number(updated.height) : null,
      },
    });
  } catch (error) {
    console.error("Update vitals error:", error);
    return NextResponse.json(
      { error: "Failed to update vital signs" },
      { status: 500 }
    );
  }
}

// DELETE - Delete vital signs record
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Vital sign record ID is required" },
        { status: 400 }
      );
    }

    await prisma.vitalSign.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: "Vital sign record deleted successfully",
    });
  } catch (error) {
    console.error("Delete vitals error:", error);
    return NextResponse.json(
      { error: "Failed to delete vital sign record" },
      { status: 500 }
    );
  }
}
