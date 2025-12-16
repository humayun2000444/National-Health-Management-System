"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Pill, Calendar, Download, Eye, Printer, Clock } from "lucide-react";

const prescriptionsData = [
  {
    id: 1,
    doctor: "Dr. Sarah Wilson",
    specialization: "Cardiology",
    date: "2024-01-20",
    diagnosis: "Hypertension",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
      },
      {
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        duration: "30 days",
      },
    ],
    instructions:
      "Take with food. Avoid alcohol. Monitor blood pressure daily.",
    validUntil: "2024-02-20",
    status: "active",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialization: "Neurology",
    date: "2024-01-15",
    diagnosis: "Migraine",
    medications: [
      {
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "As needed",
        duration: "PRN",
      },
    ],
    instructions: "Take at onset of migraine. Do not exceed 2 tablets per day.",
    validUntil: "2024-04-15",
    status: "active",
  },
  {
    id: 3,
    doctor: "Dr. James Brown",
    specialization: "Orthopedics",
    date: "2024-01-05",
    diagnosis: "Knee Pain",
    medications: [
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        duration: "14 days",
      },
    ],
    instructions: "Take with food. Avoid if stomach upset occurs.",
    validUntil: "2024-01-19",
    status: "expired",
  },
];

const filterOptions = [
  { value: "all", label: "All Prescriptions" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
];

export default function PatientPrescriptionsPage() {
  const [filter, setFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState<
    (typeof prescriptionsData)[0] | null
  >(null);

  const filteredPrescriptions = prescriptionsData.filter(
    (p) => filter === "all" || p.status === filter
  );

  return (
    <div className="min-h-screen">
      <Header
        title="My Prescriptions"
        subtitle="View your medical prescriptions"
      />

      <div className="p-6">
        {/* Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-sm text-emerald-600">
                <strong className="text-lg">
                  {prescriptionsData.filter((p) => p.status === "active").length}
                </strong>{" "}
                Active
              </span>
            </div>
          </div>
          <Select
            options={filterOptions}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Doctor & Diagnosis */}
                  <div className="flex items-start gap-4">
                    <Avatar fallback={prescription.doctor} size="lg" />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {prescription.doctor}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {prescription.specialization}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Diagnosis:{" "}
                        <span className="font-medium text-slate-700">
                          {prescription.diagnosis}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Medications Summary */}
                  <div className="flex-1 lg:mx-6">
                    <p className="text-sm text-slate-500 mb-2">Medications</p>
                    <div className="flex flex-wrap gap-2">
                      {prescription.medications.map((med, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg"
                        >
                          <Pill className="h-3 w-3 text-slate-500" />
                          <span className="text-sm">
                            {med.name} {med.dosage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <Badge
                      variant={
                        prescription.status === "active" ? "success" : "secondary"
                      }
                    >
                      {prescription.status}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(prescription.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPrescription(prescription)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-12">
            <Pill className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No prescriptions found</p>
          </div>
        )}
      </div>

      {/* Prescription Details Modal */}
      <Modal
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
        title="Prescription Details"
        size="lg"
      >
        {selectedPrescription && (
          <div className="space-y-6">
            {/* Doctor Info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <Avatar fallback={selectedPrescription.doctor} size="lg" />
              <div>
                <p className="font-semibold text-slate-900">
                  {selectedPrescription.doctor}
                </p>
                <p className="text-sm text-blue-600">
                  {selectedPrescription.specialization}
                </p>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <p className="text-sm text-slate-500 mb-1">Diagnosis</p>
              <p className="font-semibold text-slate-900">
                {selectedPrescription.diagnosis}
              </p>
            </div>

            {/* Medications */}
            <div>
              <p className="text-sm text-slate-500 mb-3">Medications</p>
              <div className="space-y-3">
                {selectedPrescription.medications.map((med, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-slate-900">
                        {med.name}
                      </span>
                      <Badge variant="secondary">{med.dosage}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Frequency:</span>{" "}
                        <span className="font-medium">{med.frequency}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Duration:</span>{" "}
                        <span className="font-medium">{med.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <p className="text-sm text-slate-500 mb-1">Instructions</p>
              <p className="text-slate-700">{selectedPrescription.instructions}</p>
            </div>

            {/* Valid Until */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500">Valid until:</span>
              <span className="font-medium">
                {new Date(selectedPrescription.validUntil).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setSelectedPrescription(null)}
          >
            Close
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
