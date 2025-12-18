// Drug Interaction Database and Checker
// This provides drug interaction warnings for prescriptions

export type InteractionSeverity = "mild" | "moderate" | "severe" | "contraindicated";

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: InteractionSeverity;
  description: string;
  recommendation: string;
}

export interface InteractionWarning {
  severity: InteractionSeverity;
  drugs: string[];
  description: string;
  recommendation: string;
}

// Common drug interaction database
// In production, this should be fetched from a comprehensive drug database API
const drugInteractions: DrugInteraction[] = [
  // Blood Thinners
  {
    drug1: "warfarin",
    drug2: "aspirin",
    severity: "severe",
    description: "Increased risk of bleeding when combined",
    recommendation: "Avoid combination or monitor closely for bleeding signs",
  },
  {
    drug1: "warfarin",
    drug2: "ibuprofen",
    severity: "severe",
    description: "NSAIDs increase bleeding risk with anticoagulants",
    recommendation: "Use acetaminophen instead for pain relief",
  },
  {
    drug1: "warfarin",
    drug2: "naproxen",
    severity: "severe",
    description: "NSAIDs increase bleeding risk with anticoagulants",
    recommendation: "Use acetaminophen instead for pain relief",
  },

  // Antibiotics
  {
    drug1: "metronidazole",
    drug2: "alcohol",
    severity: "severe",
    description: "Disulfiram-like reaction causing severe nausea and vomiting",
    recommendation: "Avoid alcohol during treatment and 48 hours after",
  },
  {
    drug1: "ciprofloxacin",
    drug2: "antacids",
    severity: "moderate",
    description: "Antacids reduce ciprofloxacin absorption",
    recommendation: "Take ciprofloxacin 2 hours before or 6 hours after antacids",
  },
  {
    drug1: "tetracycline",
    drug2: "calcium",
    severity: "moderate",
    description: "Calcium reduces tetracycline absorption",
    recommendation: "Separate doses by at least 2-3 hours",
  },
  {
    drug1: "amoxicillin",
    drug2: "methotrexate",
    severity: "severe",
    description: "Amoxicillin may increase methotrexate toxicity",
    recommendation: "Monitor for methotrexate toxicity, may need dose adjustment",
  },

  // Cardiovascular
  {
    drug1: "lisinopril",
    drug2: "potassium",
    severity: "moderate",
    description: "ACE inhibitors can increase potassium levels",
    recommendation: "Monitor potassium levels regularly",
  },
  {
    drug1: "lisinopril",
    drug2: "spironolactone",
    severity: "severe",
    description: "Risk of severe hyperkalemia",
    recommendation: "Monitor potassium closely if combination is necessary",
  },
  {
    drug1: "digoxin",
    drug2: "amiodarone",
    severity: "severe",
    description: "Amiodarone increases digoxin levels",
    recommendation: "Reduce digoxin dose by 50% when adding amiodarone",
  },
  {
    drug1: "atenolol",
    drug2: "verapamil",
    severity: "severe",
    description: "Risk of severe bradycardia and heart block",
    recommendation: "Avoid combination or use with extreme caution",
  },
  {
    drug1: "simvastatin",
    drug2: "amiodarone",
    severity: "severe",
    description: "Increased risk of muscle damage (rhabdomyolysis)",
    recommendation: "Limit simvastatin to 20mg daily with amiodarone",
  },
  {
    drug1: "simvastatin",
    drug2: "grapefruit",
    severity: "moderate",
    description: "Grapefruit increases statin levels",
    recommendation: "Avoid grapefruit juice while on simvastatin",
  },

  // Diabetes Medications
  {
    drug1: "metformin",
    drug2: "contrast dye",
    severity: "severe",
    description: "Risk of lactic acidosis with iodinated contrast",
    recommendation: "Hold metformin before and 48 hours after contrast procedures",
  },
  {
    drug1: "glipizide",
    drug2: "fluconazole",
    severity: "moderate",
    description: "Fluconazole increases sulfonylurea effect",
    recommendation: "Monitor blood glucose closely, may need dose reduction",
  },

  // Pain Medications
  {
    drug1: "tramadol",
    drug2: "ssri",
    severity: "severe",
    description: "Risk of serotonin syndrome",
    recommendation: "Use with caution, monitor for serotonin syndrome symptoms",
  },
  {
    drug1: "tramadol",
    drug2: "sertraline",
    severity: "severe",
    description: "Risk of serotonin syndrome and seizures",
    recommendation: "Avoid combination if possible, monitor closely",
  },
  {
    drug1: "codeine",
    drug2: "benzodiazepines",
    severity: "severe",
    description: "Increased risk of respiratory depression",
    recommendation: "FDA black box warning - avoid combination",
  },
  {
    drug1: "oxycodone",
    drug2: "benzodiazepines",
    severity: "severe",
    description: "Increased risk of respiratory depression and death",
    recommendation: "FDA black box warning - avoid combination",
  },

  // Psychiatric Medications
  {
    drug1: "fluoxetine",
    drug2: "maoi",
    severity: "contraindicated",
    description: "Risk of fatal serotonin syndrome",
    recommendation: "Contraindicated - do not combine, 5 week washout required",
  },
  {
    drug1: "sertraline",
    drug2: "maoi",
    severity: "contraindicated",
    description: "Risk of fatal serotonin syndrome",
    recommendation: "Contraindicated - do not combine, 2 week washout required",
  },
  {
    drug1: "lithium",
    drug2: "ibuprofen",
    severity: "severe",
    description: "NSAIDs increase lithium levels",
    recommendation: "Monitor lithium levels if NSAID is necessary",
  },
  {
    drug1: "lithium",
    drug2: "lisinopril",
    severity: "severe",
    description: "ACE inhibitors can increase lithium levels",
    recommendation: "Monitor lithium levels closely",
  },

  // Thyroid Medications
  {
    drug1: "levothyroxine",
    drug2: "calcium",
    severity: "moderate",
    description: "Calcium reduces levothyroxine absorption",
    recommendation: "Separate doses by at least 4 hours",
  },
  {
    drug1: "levothyroxine",
    drug2: "iron",
    severity: "moderate",
    description: "Iron reduces levothyroxine absorption",
    recommendation: "Separate doses by at least 4 hours",
  },

  // Erectile Dysfunction
  {
    drug1: "sildenafil",
    drug2: "nitrates",
    severity: "contraindicated",
    description: "Severe hypotension risk",
    recommendation: "Absolutely contraindicated - can cause fatal hypotension",
  },
  {
    drug1: "tadalafil",
    drug2: "nitrates",
    severity: "contraindicated",
    description: "Severe hypotension risk",
    recommendation: "Absolutely contraindicated - can cause fatal hypotension",
  },
];

// Drug name aliases for matching
const drugAliases: Record<string, string[]> = {
  warfarin: ["coumadin", "jantoven"],
  aspirin: ["asa", "acetylsalicylic acid", "ecotrin", "bayer"],
  ibuprofen: ["advil", "motrin", "nurofen"],
  naproxen: ["aleve", "naprosyn"],
  metronidazole: ["flagyl"],
  ciprofloxacin: ["cipro"],
  amoxicillin: ["amoxil", "augmentin"],
  lisinopril: ["zestril", "prinivil"],
  digoxin: ["lanoxin"],
  amiodarone: ["cordarone", "pacerone"],
  atenolol: ["tenormin"],
  verapamil: ["calan", "verelan"],
  simvastatin: ["zocor"],
  metformin: ["glucophage"],
  glipizide: ["glucotrol"],
  fluconazole: ["diflucan"],
  tramadol: ["ultram"],
  sertraline: ["zoloft"],
  fluoxetine: ["prozac"],
  codeine: ["tylenol with codeine"],
  oxycodone: ["oxycontin", "percocet"],
  lithium: ["lithobid", "eskalith"],
  levothyroxine: ["synthroid", "levoxyl"],
  sildenafil: ["viagra"],
  tadalafil: ["cialis"],
  ssri: ["sertraline", "fluoxetine", "paroxetine", "citalopram", "escitalopram"],
  maoi: ["phenelzine", "tranylcypromine", "selegiline", "isocarboxazid"],
  benzodiazepines: ["diazepam", "lorazepam", "alprazolam", "clonazepam", "valium", "ativan", "xanax"],
  nitrates: ["nitroglycerin", "isosorbide", "nitro"],
  antacids: ["tums", "maalox", "mylanta", "aluminum hydroxide", "magnesium hydroxide"],
  calcium: ["calcium carbonate", "caltrate", "os-cal"],
  potassium: ["k-dur", "klor-con", "potassium chloride"],
  iron: ["ferrous sulfate", "ferrous gluconate"],
};

/**
 * Normalize drug name for comparison
 */
function normalizeDrugName(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Get the canonical drug name from aliases
 */
function getCanonicalDrugName(drugName: string): string[] {
  const normalized = normalizeDrugName(drugName);
  const canonicalNames: string[] = [normalized];

  // Check if the drug name matches any canonical name directly
  if (drugAliases[normalized]) {
    return [normalized];
  }

  // Check if it's an alias
  for (const [canonical, aliases] of Object.entries(drugAliases)) {
    if (aliases.some(alias => normalized.includes(alias) || alias.includes(normalized))) {
      canonicalNames.push(canonical);
    }
  }

  return canonicalNames;
}

/**
 * Check for interactions between two drugs
 */
function checkPairInteraction(drug1: string, drug2: string): DrugInteraction | null {
  const canonical1 = getCanonicalDrugName(drug1);
  const canonical2 = getCanonicalDrugName(drug2);

  for (const interaction of drugInteractions) {
    const match1 = canonical1.some(d =>
      d.includes(interaction.drug1) || interaction.drug1.includes(d)
    );
    const match2 = canonical2.some(d =>
      d.includes(interaction.drug2) || interaction.drug2.includes(d)
    );

    const reverseMatch1 = canonical1.some(d =>
      d.includes(interaction.drug2) || interaction.drug2.includes(d)
    );
    const reverseMatch2 = canonical2.some(d =>
      d.includes(interaction.drug1) || interaction.drug1.includes(d)
    );

    if ((match1 && match2) || (reverseMatch1 && reverseMatch2)) {
      return interaction;
    }
  }

  return null;
}

/**
 * Check for drug interactions in a list of medications
 */
export function checkDrugInteractions(medications: string[]): InteractionWarning[] {
  const warnings: InteractionWarning[] = [];
  const checkedPairs = new Set<string>();

  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const drug1 = medications[i];
      const drug2 = medications[j];

      // Create a unique key for this pair
      const pairKey = [drug1, drug2].sort().join("|");
      if (checkedPairs.has(pairKey)) continue;
      checkedPairs.add(pairKey);

      const interaction = checkPairInteraction(drug1, drug2);
      if (interaction) {
        warnings.push({
          severity: interaction.severity,
          drugs: [drug1, drug2],
          description: interaction.description,
          recommendation: interaction.recommendation,
        });
      }
    }
  }

  // Sort by severity (most severe first)
  const severityOrder: Record<InteractionSeverity, number> = {
    contraindicated: 0,
    severe: 1,
    moderate: 2,
    mild: 3,
  };

  warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return warnings;
}

/**
 * Check if a new medication has interactions with existing medications
 */
export function checkNewMedicationInteractions(
  newMedication: string,
  existingMedications: string[]
): InteractionWarning[] {
  const warnings: InteractionWarning[] = [];

  for (const existing of existingMedications) {
    const interaction = checkPairInteraction(newMedication, existing);
    if (interaction) {
      warnings.push({
        severity: interaction.severity,
        drugs: [newMedication, existing],
        description: interaction.description,
        recommendation: interaction.recommendation,
      });
    }
  }

  // Sort by severity
  const severityOrder: Record<InteractionSeverity, number> = {
    contraindicated: 0,
    severe: 1,
    moderate: 2,
    mild: 3,
  };

  warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return warnings;
}

/**
 * Get severity color for UI display
 */
export function getSeverityColor(severity: InteractionSeverity): string {
  switch (severity) {
    case "contraindicated":
      return "red";
    case "severe":
      return "red";
    case "moderate":
      return "orange";
    case "mild":
      return "yellow";
    default:
      return "gray";
  }
}

/**
 * Get severity badge variant for UI
 */
export function getSeverityVariant(severity: InteractionSeverity): "danger" | "warning" | "secondary" {
  switch (severity) {
    case "contraindicated":
    case "severe":
      return "danger";
    case "moderate":
      return "warning";
    case "mild":
    default:
      return "secondary";
  }
}
