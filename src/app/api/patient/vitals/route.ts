import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get patient's vital signs history
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patientId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const vitals = await prisma.vitalSign.findMany({
      where: { patientId },
      include: {
        recordedBy: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
      orderBy: { recordedAt: "desc" },
      take: limit ? parseInt(limit) : 50,
    });

    // Get latest vital signs
    const latest = vitals[0] || null;

    // Calculate averages for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentVitals = vitals.filter(
      (v) => new Date(v.recordedAt) >= thirtyDaysAgo
    );

    const averages = {
      bloodPressureSystolic: calculateAverage(
        recentVitals.map((v) => v.bloodPressureSystolic)
      ),
      bloodPressureDiastolic: calculateAverage(
        recentVitals.map((v) => v.bloodPressureDiastolic)
      ),
      heartRate: calculateAverage(recentVitals.map((v) => v.heartRate)),
      temperature: calculateAverage(
        recentVitals.map((v) => (v.temperature ? Number(v.temperature) : null))
      ),
      oxygenSaturation: calculateAverage(
        recentVitals.map((v) => v.oxygenSaturation)
      ),
    };

    return NextResponse.json({
      vitals: vitals.map((v) => ({
        ...v,
        temperature: v.temperature ? Number(v.temperature) : null,
        weight: v.weight ? Number(v.weight) : null,
        height: v.height ? Number(v.height) : null,
      })),
      latest: latest
        ? {
            ...latest,
            temperature: latest.temperature ? Number(latest.temperature) : null,
            weight: latest.weight ? Number(latest.weight) : null,
            height: latest.height ? Number(latest.height) : null,
          }
        : null,
      averages,
      totalRecords: vitals.length,
    });
  } catch (error) {
    console.error("Patient vitals error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vital signs" },
      { status: 500 }
    );
  }
}

function calculateAverage(values: (number | null)[]): number | null {
  const validValues = values.filter((v): v is number => v !== null);
  if (validValues.length === 0) return null;
  return Math.round(
    validValues.reduce((sum, v) => sum + v, 0) / validValues.length
  );
}
