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
  Search,
  Eye,
  Loader2,
  RefreshCw,
  AlertCircle,
  FlaskConical,
  Clock,
  CheckCircle,
  FileText,
  Download,
  Printer,
} from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface LabTest {
  id: number;
  orderedBy: Doctor;
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
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const testTypes: Record<string, string> = {
  blood: "Blood Test",
  urine: "Urine Test",
  imaging: "Imaging",
  biopsy: "Biopsy",
  culture: "Culture Test",
  genetic: "Genetic Test",
  cardiac: "Cardiac Test",
  other: "Other",
};

export default function PatientLabTestsPage() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, in_progress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLabTests();
  }, [statusFilter]);

  const fetchLabTests = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/patient/lab-tests?${params}`);
      if (!response.ok) throw new Error("Failed to fetch lab tests");
      const data = await response.json();
      setLabTests(data.labTests);
      setStats(data.stats || { pending: 0, in_progress: 0, completed: 0 });
    } catch (err) {
      setError("Failed to load lab tests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = labTests.filter((test) => {
    const matchesSearch =
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.orderedBy.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);

  const openViewModal = (test: LabTest) => {
    setSelectedTest(test);
    setIsViewModalOpen(true);
  };

  const getStatusVariant = (status: string): "success" | "warning" | "danger" | "secondary" | "primary" => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "in_progress":
        return "primary";
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
          <p className="text-sm text-slate-500">{testTypes[test.testType] || test.testType}</p>
        </div>
      ),
    },
    {
      key: "orderedBy",
      header: "Ordered By",
      render: (test) => (
        <div>
          <p className="font-medium text-slate-900">Dr. {test.orderedBy.name}</p>
          <p className="text-sm text-slate-500">{test.orderedBy.specialization}</p>
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
      header: "Order Date",
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
          {test.status === "completed" && (
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading && labTests.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Lab Results" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Lab Results"
        subtitle="View your laboratory test results"
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
                  <p className="text-sm text-slate-500">Awaiting Results</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {(stats.pending || 0) + (stats.in_progress || 0)}
                  </p>
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
                  <p className="text-2xl font-bold text-blue-600">{labTests.length}</p>
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
                  <p className="text-sm text-slate-500">This Month</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {labTests.filter(t => {
                      const testDate = new Date(t.createdAt);
                      const now = new Date();
                      return testDate.getMonth() === now.getMonth() && testDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-slate-100 rounded-full">
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search tests or doctors..."
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
        </div>

        {/* Lab Tests Table */}
        {filteredTests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FlaskConical className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Lab Tests</h3>
              <p className="text-slate-500">
                {statusFilter !== "all"
                  ? `No ${statusFilter.replace("_", " ")} lab tests found.`
                  : "You don't have any lab tests yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
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
          </>
        )}
      </div>

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
                <p className="text-slate-500">{testTypes[selectedTest.testType] || selectedTest.testType}</p>
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
                <p className="text-slate-500">Ordered By</p>
                <p className="font-medium">Dr. {selectedTest.orderedBy.name}</p>
                <p className="text-slate-500">{selectedTest.orderedBy.specialization}</p>
              </div>
              <div>
                <p className="text-slate-500">Order Date</p>
                <p className="font-medium">{new Date(selectedTest.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {selectedTest.status === "completed" && selectedTest.results ? (
              <>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Results
                  </h4>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
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

                {selectedTest.referenceRange && (
                  <div>
                    <h4 className="font-medium mb-2">Reference Range</h4>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                    <h4 className="font-medium mb-2">Doctor's Interpretation</h4>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700">{selectedTest.interpretation}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg">
                <Clock className="h-12 w-12 mx-auto text-amber-500 mb-3" />
                <h4 className="font-medium text-slate-900 mb-1">Results Pending</h4>
                <p className="text-sm text-slate-500">
                  Your lab test is being processed. Results will appear here once ready.
                </p>
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
          {selectedTest?.status === "completed" && (
            <>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
