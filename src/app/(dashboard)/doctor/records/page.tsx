"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Select";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import {
  Search,
  Plus,
  FileText,
  Image,
  TestTube,
  Syringe,
  Eye,
  Download,
  Calendar,
} from "lucide-react";

const recordsData = [
  {
    id: 1,
    patient: "John Smith",
    type: "diagnosis",
    title: "Hypertension Diagnosis",
    date: "2024-01-20",
    description: "Patient diagnosed with Stage 1 hypertension",
  },
  {
    id: 2,
    patient: "Emily Davis",
    type: "lab_report",
    title: "Blood Test Results",
    date: "2024-01-19",
    description: "HbA1c levels elevated at 7.2%",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    type: "imaging",
    title: "ECG Report",
    date: "2024-01-18",
    description: "Irregular heart rhythm detected",
  },
  {
    id: 4,
    patient: "Lisa Anderson",
    type: "vaccination",
    title: "Flu Vaccine Administration",
    date: "2024-01-15",
    description: "Annual flu vaccine administered",
  },
];

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "diagnosis", label: "Diagnosis" },
  { value: "lab_report", label: "Lab Report" },
  { value: "imaging", label: "Imaging" },
  { value: "vaccination", label: "Vaccination" },
  { value: "surgery", label: "Surgery" },
];

const typeIcons: Record<string, React.ReactNode> = {
  diagnosis: <FileText className="h-5 w-5" />,
  lab_report: <TestTube className="h-5 w-5" />,
  imaging: <Image className="h-5 w-5" />,
  vaccination: <Syringe className="h-5 w-5" />,
};

const typeColors: Record<string, string> = {
  diagnosis: "bg-blue-100 text-blue-600",
  lab_report: "bg-emerald-100 text-emerald-600",
  imaging: "bg-purple-100 text-purple-600",
  vaccination: "bg-amber-100 text-amber-600",
};

const patientOptions = [
  { value: "1", label: "John Smith" },
  { value: "2", label: "Emily Davis" },
  { value: "3", label: "Robert Johnson" },
  { value: "4", label: "Lisa Anderson" },
];

export default function MedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredRecords = recordsData.filter((record) => {
    const matchesSearch =
      record.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || record.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Medical Records"
        subtitle="Create and manage patient records"
      />

      <div className="p-6">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-40">
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      typeColors[record.type] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {typeIcons[record.type] || (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {record.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar fallback={record.patient} size="xs" />
                          <span className="text-sm text-slate-500">
                            {record.patient}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" size="sm">
                        {record.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      {record.description}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(record.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No records found.</p>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Medical Record"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Patient"
              options={patientOptions}
              placeholder="Select patient"
            />
            <Select
              label="Record Type"
              options={typeOptions.slice(1)}
              placeholder="Select type"
            />
          </div>
          <Input label="Title" placeholder="Enter record title" />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter record description..."
            />
          </div>
          <Input label="Record Date" type="date" />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Attachments
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <p className="text-sm text-slate-500">
                Drag and drop files here, or click to browse
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Browse Files
              </Button>
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Create Record
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
