"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Table, Column } from "@/components/ui/Table";
import {
  Plus,
  Search,
  FileText,
  Printer,
  Download,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: number;
  patient: string;
  patientId: number;
  patientAvatar: string | null;
  date: string;
  diagnosis: string;
  medications: Medication[];
  medicationsCount: number;
  instructions: string | null;
  validUntil: string | null;
  status: string;
}

interface Patient {
  id: number;
  name: string;
}

export default function PrescriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewPrescription, setViewPrescription] = useState<Prescription | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [selectedPatient, setSelectedPatient] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [instructions, setInstructions] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/doctor/prescriptions");
      if (!response.ok) throw new Error("Failed to fetch prescriptions");

      const data = await response.json();
      setPrescriptions(data.prescriptions);
    } catch (err) {
      setError("Failed to load prescriptions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/doctor/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");

      const data = await response.json();
      setPatients(data.patients.map((p: Patient) => ({ id: p.id, name: p.name })));
    } catch (err) {
      console.error(err);
    }
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const newMeds = [...medications];
    newMeds[index][field] = value;
    setMedications(newMeds);
  };

  const resetForm = () => {
    setSelectedPatient("");
    setDiagnosis("");
    setInstructions("");
    setValidUntil("");
    setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleCreatePrescription = async () => {
    if (!selectedPatient || !diagnosis || !medications[0].name) {
      setError("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/doctor/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient,
          diagnosis,
          medications: medications.filter((m) => m.name),
          instructions: instructions || null,
          validUntil: validUntil || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create prescription");
      }

      setSuccess("Prescription created successfully!");
      setIsAddModalOpen(false);
      resetForm();
      fetchPrescriptions();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create prescription");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = (prescription: Prescription) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${prescription.patient}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #0066cc; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .patient-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .patient-info h3 { margin: 0 0 10px 0; }
          .diagnosis { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .medications { margin-bottom: 20px; }
          .medications h3 { margin-bottom: 15px; }
          .med-item { background: #fff; border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
          .med-name { font-weight: bold; font-size: 16px; color: #333; }
          .med-details { color: #666; margin-top: 5px; }
          .instructions { background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .footer { margin-top: 40px; text-align: right; }
          .footer .signature { border-top: 1px solid #333; width: 200px; display: inline-block; padding-top: 10px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Medical Prescription</h1>
          <p>Date: ${new Date(prescription.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>

        <div class="patient-info">
          <h3>Patient: ${prescription.patient}</h3>
        </div>

        <div class="diagnosis">
          <strong>Diagnosis:</strong> ${prescription.diagnosis}
        </div>

        <div class="medications">
          <h3>Prescribed Medications:</h3>
          ${prescription.medications.map((med) => `
            <div class="med-item">
              <div class="med-name">${med.name}</div>
              <div class="med-details">
                Dosage: ${med.dosage || "N/A"} |
                Frequency: ${med.frequency || "N/A"} |
                Duration: ${med.duration || "N/A"}
              </div>
            </div>
          `).join("")}
        </div>

        ${prescription.instructions ? `
          <div class="instructions">
            <strong>Instructions:</strong> ${prescription.instructions}
          </div>
        ` : ""}

        ${prescription.validUntil ? `
          <p><strong>Valid Until:</strong> ${new Date(prescription.validUntil).toLocaleDateString()}</p>
        ` : ""}

        <div class="footer">
          <div class="signature">Doctor's Signature</div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patientOptions = [
    { value: "", label: "Select Patient" },
    ...patients.map((p) => ({ value: p.id.toString(), label: p.name })),
  ];

  const columns: Column<Prescription>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar src={p.patientAvatar || undefined} fallback={p.patient} size="sm" />
          <span className="font-medium text-slate-900">{p.patient}</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (p) =>
        new Date(p.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      key: "diagnosis",
      header: "Diagnosis",
      render: (p) => (
        <span className="truncate max-w-[200px] block">{p.diagnosis}</span>
      ),
    },
    {
      key: "medications",
      header: "Medications",
      render: (p) => (
        <Badge variant="secondary">{p.medicationsCount} items</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <Badge variant={p.status === "active" ? "success" : "secondary"}>
          {p.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewPrescription(p)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePrint(p)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePrint(p)}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading && prescriptions.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Prescriptions" subtitle="Create and manage prescriptions" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Prescriptions" subtitle="Create and manage prescriptions" />

      <div className="p-6">
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
            <button onClick={() => setError("")} className="ml-auto">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Prescription
          </Button>
        </div>

        {/* Prescriptions Table */}
        {filteredPrescriptions.length > 0 ? (
          <Table
            columns={columns}
            data={filteredPrescriptions}
            keyExtractor={(p) => p.id}
          />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No prescriptions found.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setIsAddModalOpen(true)}
              >
                Create your first prescription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Prescription Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="New Prescription"
        size="xl"
      >
        <div className="space-y-6">
          {/* Patient & Diagnosis */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Patient *"
              options={patientOptions}
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            />
            <Input
              label="Diagnosis *"
              placeholder="Enter diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-700">
                Medications *
              </label>
              <Button variant="ghost" size="sm" onClick={addMedication}>
                <Plus className="h-4 w-4 mr-1" />
                Add Medication
              </Button>
            </div>

            <div className="space-y-3">
              {medications.map((med, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <Input
                        placeholder="Medication name"
                        value={med.name}
                        onChange={(e) => updateMedication(index, "name", e.target.value)}
                      />
                      <Input
                        placeholder="Dosage (e.g., 500mg)"
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                      />
                      <Input
                        placeholder="Frequency (e.g., twice daily)"
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                      />
                      <Input
                        placeholder="Duration (e.g., 7 days)"
                        value={med.duration}
                        onChange={(e) => updateMedication(index, "duration", e.target.value)}
                      />
                    </div>
                    {medications.length > 1 && (
                      <button
                        onClick={() => removeMedication(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Additional Instructions
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special instructions for the patient..."
            />
          </div>

          {/* Valid Until */}
          <Input
            label="Valid Until"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreatePrescription} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Create Prescription
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Prescription Modal */}
      <Modal
        isOpen={!!viewPrescription}
        onClose={() => setViewPrescription(null)}
        title="Prescription Details"
        size="lg"
      >
        {viewPrescription && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar
                src={viewPrescription.patientAvatar || undefined}
                fallback={viewPrescription.patient}
                size="lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {viewPrescription.patient}
                </h3>
                <p className="text-slate-500">
                  {new Date(viewPrescription.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <Badge
                  variant={viewPrescription.status === "active" ? "success" : "secondary"}
                >
                  {viewPrescription.status}
                </Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Diagnosis</p>
              <p className="text-blue-700">{viewPrescription.diagnosis}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                Medications ({viewPrescription.medicationsCount})
              </h4>
              <div className="space-y-2">
                {viewPrescription.medications.map((med, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-medium text-slate-900">{med.name}</p>
                    <p className="text-sm text-slate-600">
                      {med.dosage && `${med.dosage}`}
                      {med.frequency && ` | ${med.frequency}`}
                      {med.duration && ` | ${med.duration}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {viewPrescription.instructions && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm font-medium text-amber-800">Instructions</p>
                <p className="text-amber-700">{viewPrescription.instructions}</p>
              </div>
            )}

            {viewPrescription.validUntil && (
              <p className="text-sm text-slate-600">
                <strong>Valid Until:</strong>{" "}
                {new Date(viewPrescription.validUntil).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setViewPrescription(null)}>
            Close
          </Button>
          {viewPrescription && (
            <Button onClick={() => handlePrint(viewPrescription)}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
