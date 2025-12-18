"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, Pagination, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Loader2,
  RefreshCw,
  AlertCircle,
  FlaskConical,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
}

interface LabTest {
  id: number;
  patientId: number;
  patient: Patient;
  testName: string;
  testType: string;
  status: string;
  priority: string;
  results: Record<string, unknown> | null;
  referenceRange: Record<string, unknown> | null;
  interpretation: string | null;
  notes: string | null;
  createdAt: string;
  resultDate: string | null;
}

interface Stats {
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

interface DoctorPatient {
  id: number;
  name: string;
  email: string;
}

interface OrderFormData {
  patientId: string;
  testName: string;
  testType: string;
  priority: string;
  notes: string;
}

interface ResultFormData {
  results: string;
  referenceRange: string;
  interpretation: string;
  notes: string;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const testTypes = [
  { value: "blood", label: "Blood Test" },
  { value: "urine", label: "Urine Test" },
  { value: "imaging", label: "Imaging (X-Ray, CT, MRI)" },
  { value: "biopsy", label: "Biopsy" },
  { value: "culture", label: "Culture Test" },
  { value: "genetic", label: "Genetic Test" },
  { value: "cardiac", label: "Cardiac Test" },
  { value: "other", label: "Other" },
];

const priorityOptions = [
  { value: "routine", label: "Routine" },
  { value: "urgent", label: "Urgent" },
  { value: "stat", label: "STAT (Emergency)" },
];

const commonTests = [
  "Complete Blood Count (CBC)",
  "Basic Metabolic Panel (BMP)",
  "Comprehensive Metabolic Panel (CMP)",
  "Lipid Panel",
  "Liver Function Tests (LFTs)",
  "Thyroid Panel",
  "Hemoglobin A1C",
  "Urinalysis",
  "Chest X-Ray",
  "ECG/EKG",
  "MRI",
  "CT Scan",
  "Ultrasound",
];

const initialOrderForm: OrderFormData = {
  patientId: "",
  testName: "",
  testType: "blood",
  priority: "routine",
  notes: "",
};

const initialResultForm: ResultFormData = {
  results: "",
  referenceRange: "",
  interpretation: "",
  notes: "",
};

export default function LabTestsPage() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, in_progress: 0, completed: 0, cancelled: 0 });
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [orderForm, setOrderForm] = useState<OrderFormData>(initialOrderForm);
  const [resultForm, setResultForm] = useState<ResultFormData>(initialResultForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLabTests();
    fetchPatients();
  }, [statusFilter]);

  const fetchLabTests = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/doctor/lab-tests?${params}`);
      if (!response.ok) throw new Error("Failed to fetch lab tests");
      const data = await response.json();
      setLabTests(data.labTests);
      setStats(data.stats || { pending: 0, in_progress: 0, completed: 0, cancelled: 0 });
    } catch (err) {
      setError("Failed to load lab tests");
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
      setPatients(data.patients || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTests = labTests.filter((test) => {
    const matchesSearch =
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);

  const handleOrderTest = async () => {
    if (!orderForm.patientId || !orderForm.testName || !orderForm.testType) {
      setFormError("Patient, test name, and test type are required");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/doctor/lab-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to order lab test");
      }

      setIsOrderModalOpen(false);
      setOrderForm(initialOrderForm);
      fetchLabTests();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to order lab test");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddResults = async () => {
    if (!selectedTest) return;
    if (!resultForm.results.trim()) {
      setFormError("Results are required");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      let parsedResults;
      let parsedRange;

      try {
        parsedResults = JSON.parse(resultForm.results);
      } catch {
        // If not valid JSON, store as simple object
        parsedResults = { value: resultForm.results };
      }

      if (resultForm.referenceRange) {
        try {
          parsedRange = JSON.parse(resultForm.referenceRange);
        } catch {
          parsedRange = { range: resultForm.referenceRange };
        }
      }

      const response = await fetch("/api/doctor/lab-tests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTest.id,
          results: parsedResults,
          referenceRange: parsedRange,
          interpretation: resultForm.interpretation || null,
          notes: resultForm.notes || null,
          status: "completed",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add results");
      }

      setIsResultModalOpen(false);
      setResultForm(initialResultForm);
      setSelectedTest(null);
      fetchLabTests();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to add results");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelTest = async (testId: number) => {
    if (!confirm("Are you sure you want to cancel this lab test?")) return;

    try {
      const response = await fetch(`/api/doctor/lab-tests?id=${testId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel test");
      }

      fetchLabTests();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel test");
    }
  };

  const openViewModal = (test: LabTest) => {
    setSelectedTest(test);
    setIsViewModalOpen(true);
  };

  const openResultModal = (test: LabTest) => {
    setSelectedTest(test);
    setResultForm(initialResultForm);
    setFormError("");
    setIsResultModalOpen(true);
  };

  const getStatusVariant = (status: string): "success" | "warning" | "danger" | "secondary" | "primary" => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "in_progress":
        return "primary";
      case "cancelled":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getPriorityVariant = (priority: string): "success" | "warning" | "danger" | "secondary" | "primary" => {
    switch (priority) {
      case "stat":
        return "danger";
      case "urgent":
        return "warning";
      default:
        return "secondary";
    }
  };

  const columns: Column<LabTest>[] = [
    {
      key: "testName",
      header: "Test",
      render: (test) => (
        <div>
          <p className="font-medium text-slate-900">{test.testName}</p>
          <p className="text-sm text-slate-500">{testTypes.find(t => t.value === test.testType)?.label || test.testType}</p>
        </div>
      ),
    },
    {
      key: "patient",
      header: "Patient",
      render: (test) => (
        <div>
          <p className="font-medium text-slate-900">{test.patient.name}</p>
          <p className="text-sm text-slate-500">{test.patient.email}</p>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (test) => (
        <Badge variant={getPriorityVariant(test.priority)}>
          {test.priority.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (test) => (
        <Badge variant={getStatusVariant(test.status)}>
          {test.status.replace("_", " ").charAt(0).toUpperCase() + test.status.replace("_", " ").slice(1)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Ordered",
      render: (test) => new Date(test.createdAt).toLocaleDateString(),
    },
    {
      key: "resultDate",
      header: "Result Date",
      render: (test) => test.resultDate ? new Date(test.resultDate).toLocaleDateString() : "-",
    },
    {
      key: "actions",
      header: "Actions",
      render: (test) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openViewModal(test)}>
            <Eye className="h-4 w-4" />
          </Button>
          {(test.status === "pending" || test.status === "in_progress") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openResultModal(test)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {test.status === "pending" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCancelTest(test.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading && labTests.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Lab Tests" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Lab Tests"
        subtitle="Order and manage laboratory tests"
      />

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
            <Button variant="ghost" size="sm" onClick={fetchLabTests} className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending || 0}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.in_progress || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FlaskConical className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Tests</p>
                  <p className="text-2xl font-bold text-slate-900">{labTests.length}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-full">
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-44">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={() => {
              setOrderForm(initialOrderForm);
              setFormError("");
              setIsOrderModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Order Lab Test
          </Button>
        </div>

        {/* Lab Tests Table */}
        <Table
          columns={columns}
          data={paginatedTests}
          keyExtractor={(test) => test.id.toString()}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTests.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Order Lab Test Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Order Lab Test"
        size="lg"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}

          <Select
            label="Patient"
            options={[
              { value: "", label: "Select a patient" },
              ...patients.map((p) => ({ value: p.id.toString(), label: `${p.name} (${p.email})` })),
            ]}
            value={orderForm.patientId}
            onChange={(e) => setOrderForm({ ...orderForm, patientId: e.target.value })}
            required
          />

          <div>
            <Input
              label="Test Name"
              value={orderForm.testName}
              onChange={(e) => setOrderForm({ ...orderForm, testName: e.target.value })}
              placeholder="Enter test name or select common test"
              required
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {commonTests.slice(0, 6).map((test) => (
                <button
                  key={test}
                  type="button"
                  onClick={() => setOrderForm({ ...orderForm, testName: test })}
                  className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
                >
                  {test}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Test Type"
              options={testTypes}
              value={orderForm.testType}
              onChange={(e) => setOrderForm({ ...orderForm, testType: e.target.value })}
              required
            />
            <Select
              label="Priority"
              options={priorityOptions}
              value={orderForm.priority}
              onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={orderForm.notes}
              onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
              placeholder="Clinical notes, patient instructions, etc."
            />
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsOrderModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleOrderTest} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Ordering...
              </>
            ) : (
              "Order Test"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Lab Test Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Lab Test Details"
        size="lg"
      >
        {selectedTest && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{selectedTest.testName}</h3>
                <p className="text-slate-500">{testTypes.find(t => t.value === selectedTest.testType)?.label}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getPriorityVariant(selectedTest.priority)}>
                  {selectedTest.priority.toUpperCase()}
                </Badge>
                <Badge variant={getStatusVariant(selectedTest.status)}>
                  {selectedTest.status.replace("_", " ")}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Patient</p>
                <p className="font-medium">{selectedTest.patient.name}</p>
                <p className="text-slate-500">{selectedTest.patient.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Order Date</p>
                <p className="font-medium">{new Date(selectedTest.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {selectedTest.results && (
              <div>
                <h4 className="font-medium mb-2">Results</h4>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {typeof selectedTest.results === "object"
                      ? JSON.stringify(selectedTest.results, null, 2)
                      : selectedTest.results}
                  </pre>
                </div>
                {selectedTest.resultDate && (
                  <p className="text-sm text-slate-500 mt-2">
                    Result Date: {new Date(selectedTest.resultDate).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {selectedTest.referenceRange && (
              <div>
                <h4 className="font-medium mb-2">Reference Range</h4>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {typeof selectedTest.referenceRange === "object"
                      ? JSON.stringify(selectedTest.referenceRange, null, 2)
                      : selectedTest.referenceRange}
                  </pre>
                </div>
              </div>
            )}

            {selectedTest.interpretation && (
              <div>
                <h4 className="font-medium mb-2">Interpretation</h4>
                <p className="text-sm text-slate-700">{selectedTest.interpretation}</p>
              </div>
            )}

            {selectedTest.notes && (
              <div>
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-sm text-slate-600">{selectedTest.notes}</p>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
          {selectedTest && (selectedTest.status === "pending" || selectedTest.status === "in_progress") && (
            <Button onClick={() => {
              setIsViewModalOpen(false);
              openResultModal(selectedTest);
            }}>
              <Edit2 className="h-4 w-4 mr-2" />
              Add Results
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Add Results Modal */}
      <Modal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title="Add Lab Results"
        size="lg"
      >
        {selectedTest && (
          <div className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Test</p>
              <p className="font-semibold">{selectedTest.testName}</p>
              <p className="text-sm text-slate-500 mt-1">Patient: {selectedTest.patient.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Results <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                rows={4}
                value={resultForm.results}
                onChange={(e) => setResultForm({ ...resultForm, results: e.target.value })}
                placeholder='Enter results (e.g., "Hemoglobin: 14.2 g/dL" or JSON format)'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reference Range
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                rows={2}
                value={resultForm.referenceRange}
                onChange={(e) => setResultForm({ ...resultForm, referenceRange: e.target.value })}
                placeholder='Enter reference range (e.g., "12-17 g/dL")'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Interpretation
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={resultForm.interpretation}
                onChange={(e) => setResultForm({ ...resultForm, interpretation: e.target.value })}
                placeholder="Clinical interpretation of results"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Additional Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={resultForm.notes}
                onChange={(e) => setResultForm({ ...resultForm, notes: e.target.value })}
                placeholder="Any additional notes"
              />
            </div>
          </div>
        )}
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsResultModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleAddResults} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Results"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
