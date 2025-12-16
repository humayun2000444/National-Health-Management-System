"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
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
} from "lucide-react";

interface Prescription {
  id: number;
  patient: string;
  date: string;
  diagnosis: string;
  medications: number;
  status: string;
}

const prescriptionsData: Prescription[] = [
  {
    id: 1,
    patient: "John Smith",
    date: "2024-01-20",
    diagnosis: "Hypertension",
    medications: 3,
    status: "active",
  },
  {
    id: 2,
    patient: "Emily Davis",
    date: "2024-01-19",
    diagnosis: "Diabetes Type 2",
    medications: 2,
    status: "active",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    date: "2024-01-15",
    diagnosis: "Heart Arrhythmia",
    medications: 4,
    status: "completed",
  },
  {
    id: 4,
    patient: "Lisa Anderson",
    date: "2024-01-10",
    diagnosis: "Anxiety",
    medications: 1,
    status: "completed",
  },
];

const patientOptions = [
  { value: "1", label: "John Smith" },
  { value: "2", label: "Emily Davis" },
  { value: "3", label: "Robert Johnson" },
  { value: "4", label: "Lisa Anderson" },
];

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  const filteredPrescriptions = prescriptionsData.filter(
    (p) =>
      p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const columns: Column<Prescription>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar fallback={p.patient} size="sm" />
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
    },
    {
      key: "medications",
      header: "Medications",
      render: (p) => (
        <Badge variant="secondary">{p.medications} items</Badge>
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
          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Printer className="h-4 w-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Header title="Prescriptions" subtitle="Create and manage prescriptions" />

      <div className="p-6">
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
        <Table
          columns={columns}
          data={filteredPrescriptions}
          keyExtractor={(p) => p.id}
        />
      </div>

      {/* New Prescription Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Prescription"
        size="xl"
      >
        <div className="space-y-6">
          {/* Patient & Diagnosis */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Patient"
              options={patientOptions}
              placeholder="Select patient"
            />
            <Input label="Diagnosis" placeholder="Enter diagnosis" />
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-700">
                Medications
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
                        onChange={(e) => {
                          const newMeds = [...medications];
                          newMeds[index].name = e.target.value;
                          setMedications(newMeds);
                        }}
                      />
                      <Input
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => {
                          const newMeds = [...medications];
                          newMeds[index].dosage = e.target.value;
                          setMedications(newMeds);
                        }}
                      />
                      <Input
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) => {
                          const newMeds = [...medications];
                          newMeds[index].frequency = e.target.value;
                          setMedications(newMeds);
                        }}
                      />
                      <Input
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) => {
                          const newMeds = [...medications];
                          newMeds[index].duration = e.target.value;
                          setMedications(newMeds);
                        }}
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special instructions for the patient..."
            />
          </div>

          {/* Valid Until */}
          <Input label="Valid Until" type="date" />
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Create Prescription
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
