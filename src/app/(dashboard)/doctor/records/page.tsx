"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
  CheckCircle,
  Scissors,
} from "lucide-react";

interface MedicalRecord {
  id: number;
  patient: string;
  patientId: number;
  patientAvatar: string | null;
  type: string;
  title: string;
  description: string | null;
  date: string;
  attachments: string | null;
  createdAt: string;
}

interface Patient {
  id: number;
  name: string;
}

interface Counts {
  [key: string]: number;
}

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
  surgery: <Scissors className="h-5 w-5" />,
};

const typeColors: Record<string, string> = {
  diagnosis: "bg-blue-100 text-blue-600",
  lab_report: "bg-emerald-100 text-emerald-600",
  imaging: "bg-purple-100 text-purple-600",
  vaccination: "bg-amber-100 text-amber-600",
  surgery: "bg-red-100 text-red-600",
};

export default function MedicalRecordsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [counts, setCounts] = useState<Counts>({});
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [selectedPatient, setSelectedPatient] = useState("");
  const [recordType, setRecordType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchRecords();
    fetchPatients();
  }, [typeFilter]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter) params.append("type", typeFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/doctor/records?${params}`);
      if (!response.ok) throw new Error("Failed to fetch records");

      const data = await response.json();
      setRecords(data.records);
      setCounts(data.counts || {});
    } catch (err) {
      setError("Failed to load records");
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

  const resetForm = () => {
    setSelectedPatient("");
    setRecordType("");
    setTitle("");
    setDescription("");
    setRecordDate(new Date().toISOString().split("T")[0]);
  };

  const handleCreateRecord = async () => {
    if (!selectedPatient || !recordType || !title) {
      setError("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/doctor/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient,
          type: recordType,
          title,
          description: description || null,
          recordDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create record");
      }

      setSuccess("Medical record created successfully!");
      setIsAddModalOpen(false);
      resetForm();
      fetchRecords();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create record");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = (record: MedicalRecord) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Record - ${record.patient}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #0066cc; margin: 0; }
          .patient-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .record-type { display: inline-block; background: #e3f2fd; padding: 5px 15px; border-radius: 20px; margin-bottom: 15px; }
          .content { background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
          .content h3 { margin: 0 0 10px 0; }
          .description { color: #333; line-height: 1.6; }
          .meta { color: #666; font-size: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Medical Record</h1>
        </div>

        <div class="patient-info">
          <strong>Patient:</strong> ${record.patient}<br>
          <strong>Date:</strong> ${new Date(record.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>

        <div class="record-type">${record.type.replace("_", " ").toUpperCase()}</div>

        <div class="content">
          <h3>${record.title}</h3>
          ${record.description ? `<p class="description">${record.description}</p>` : ""}
        </div>

        <div class="meta">
          Record created: ${new Date(record.createdAt).toLocaleString()}
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const patientOptions = [
    { value: "", label: "Select Patient" },
    ...patients.map((p) => ({ value: p.id.toString(), label: p.name })),
  ];

  const recordTypeOptions = typeOptions.slice(1); // Remove "All Types" option for form

  if (loading && records.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Medical Records" subtitle="Create and manage patient records" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Medical Records" subtitle="Create and manage patient records" />

      <div className="p-6">
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
              &times;
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {typeOptions.slice(1).map((type) => (
            <Card key={type.value}>
              <CardContent className="p-4">
                <p className="text-sm text-slate-500">{type.label}</p>
                <p className="text-2xl font-bold text-slate-900">{counts[type.value] || 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchRecords()}
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
        {filteredRecords.length > 0 ? (
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
                      {typeIcons[record.type] || <FileText className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {record.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar
                              src={record.patientAvatar || undefined}
                              fallback={record.patient}
                              size="xs"
                            />
                            <span className="text-sm text-slate-500">
                              {record.patient}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" size="sm">
                          {record.type.replace("_", " ")}
                        </Badge>
                      </div>
                      {record.description && (
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                          {record.description}
                        </p>
                      )}
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
                          <button
                            onClick={() => setViewRecord(record)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePrint(record)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
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
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No records found.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setIsAddModalOpen(true)}
              >
                Create your first record
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Record Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add Medical Record"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Patient *"
              options={patientOptions}
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            />
            <Select
              label="Record Type *"
              options={[{ value: "", label: "Select Type" }, ...recordTypeOptions]}
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
            />
          </div>
          <Input
            label="Title *"
            placeholder="Enter record title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter record description..."
            />
          </div>
          <Input
            label="Record Date"
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
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
          <Button onClick={handleCreateRecord} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Create Record
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Record Modal */}
      <Modal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title="Record Details"
        size="lg"
      >
        {viewRecord && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-xl ${
                  typeColors[viewRecord.type] || "bg-slate-100 text-slate-600"
                }`}
              >
                {typeIcons[viewRecord.type] || <FileText className="h-6 w-6" />}
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  {viewRecord.type.replace("_", " ")}
                </Badge>
                <h3 className="text-lg font-semibold text-slate-900">
                  {viewRecord.title}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <Avatar
                  src={viewRecord.patientAvatar || undefined}
                  fallback={viewRecord.patient}
                  size="sm"
                />
                <span className="font-medium text-slate-900">{viewRecord.patient}</span>
              </div>
              <p className="text-sm text-slate-500">
                Record Date:{" "}
                {new Date(viewRecord.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {viewRecord.description && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Description</h4>
                <p className="text-slate-600 whitespace-pre-wrap">{viewRecord.description}</p>
              </div>
            )}

            <p className="text-xs text-slate-400">
              Created: {new Date(viewRecord.createdAt).toLocaleString()}
            </p>
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setViewRecord(null)}>
            Close
          </Button>
          {viewRecord && (
            <Button onClick={() => handlePrint(viewRecord)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
