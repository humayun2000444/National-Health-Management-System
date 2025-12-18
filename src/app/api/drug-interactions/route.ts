import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  checkDrugInteractions,
  checkNewMedicationInteractions,
} from "@/lib/drug-interactions";

// POST - Check for drug interactions
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { medications, newMedication, existingMedications } = body;

    // Check interactions for a list of medications
    if (medications && Array.isArray(medications)) {
      const warnings = checkDrugInteractions(medications);
      return NextResponse.json({
        hasInteractions: warnings.length > 0,
        warnings,
      });
    }

    // Check if new medication interacts with existing ones
    if (newMedication && existingMedications && Array.isArray(existingMedications)) {
      const warnings = checkNewMedicationInteractions(newMedication, existingMedications);
      return NextResponse.json({
        hasInteractions: warnings.length > 0,
        warnings,
      });
    }

    return NextResponse.json(
      { error: "Please provide medications array or newMedication with existingMedications" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Drug interaction check error:", error);
    return NextResponse.json(
      { error: "Failed to check drug interactions" },
      { status: 500 }
    );
  }
}
