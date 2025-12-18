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
  Download,
  Eye,
  Loader2,
  RefreshCw,
  AlertCircle,
  Shield,
  LogIn,
  AlertTriangle,
  Activity,
  FileText,
  Filter,
  Calendar,
  User,
  Trash2,
} from "lucide-react";

interface AuditLog {
  id: number;
  userId: number;
  userType: string;
  action: string;
  resource: string;
  resourceId: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface Stats {
  todayTotal: number;
  todayLogins: number;
  todayAccessDenied: number;
  byAction: Record<string, number>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const actionOptions = [
  { value: "all", label: "All Actions" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "create", label: "Create" },
  { value: "read", label: "Read" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "export", label: "Export" },
  { value: "print", label: "Print" },
  { value: "access_denied", label: "Access Denied" },
];

const resourceOptions = [
  { value: "all", label: "All Resources" },
  { value: "user", label: "User" },
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "appointment", label: "Appointment" },
  { value: "prescription", label: "Prescription" },
  { value: "medical_record", label: "Medical Record" },
  { value: "lab_test", label: "Lab Test" },
  { value: "vital_sign", label: "Vital Sign" },
  { value: "invoice", label: "Invoice" },
  { value: "payment", label: "Payment" },
  { value: "settings", label: "Settings" },
];

const userTypeOptions = [
  { value: "all", label: "All User Types" },
  { value: "admin", label: "Admin" },
  { value: "doctor", label: "Doctor" },
  { value: "patient", label: "Patient" },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<Stats>({
    todayTotal: 0,
    todayLogins: 0,
    todayAccessDenied: 0,
    byAction: {},
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, resourceFilter, userTypeFilter, startDate, endDate, pagination.page]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      if (actionFilter !== "all") params.append("action", actionFilter);
      if (resourceFilter !== "all") params.append("resource", resourceFilter);
      if (userTypeFilter !== "all") params.append("userType", userTypeFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch audit logs");
      const data = await response.json();
      setLogs(data.logs);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load audit logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const openViewModal = (log: AuditLog) => {
    setSelectedLog(log);
    setIsViewModalOpen(true);
  };

  const getActionVariant = (action: string): "success" | "warning" | "danger" | "secondary" | "primary" => {
    switch (action) {
      case "login":
        return "success";
      case "logout":
        return "secondary";
      case "create":
        return "primary";
      case "update":
        return "warning";
      case "delete":
        return "danger";
      case "access_denied":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "login":
      case "logout":
        return <LogIn className="h-4 w-4" />;
      case "access_denied":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const columns: Column<AuditLog>[] = [
    {
      key: "createdAt",
      header: "Timestamp",
      render: (log) => (
        <div>
          <p className="font-medium text-slate-900">
            {new Date(log.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-slate-500">
            {new Date(log.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (log) => (
        <div>
          <p className="font-medium text-slate-900">User #{log.userId}</p>
          <Badge variant="secondary" className="text-xs">
            {log.userType}
          </Badge>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (log) => (
        <Badge variant={getActionVariant(log.action)} className="flex items-center gap-1 w-fit">
          {getActionIcon(log.action)}
          {log.action.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "resource",
      header: "Resource",
      render: (log) => (
        <div>
          <p className="font-medium text-slate-900 capitalize">{log.resource.replace("_", " ")}</p>
          {log.resourceId && (
            <p className="text-sm text-slate-500">ID: {log.resourceId}</p>
          )}
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (log) => (
        <p className="text-sm text-slate-600 max-w-xs truncate">{log.description}</p>
      ),
    },
    {
      key: "ipAddress",
      header: "IP Address",
      render: (log) => (
        <span className="text-sm text-slate-500 font-mono">
          {log.ipAddress || "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (log) => (
        <Button variant="ghost" size="sm" onClick={() => openViewModal(log)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Audit Logs" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Audit Logs"
        subtitle="Track system activity for compliance"
      />

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
            <Button variant="ghost" size="sm" onClick={fetchLogs} className="ml-auto">
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
                  <p className="text-sm text-slate-500">Today&apos;s Activity</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.todayTotal}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Login Attempts</p>
                  <p className="text-2xl font-bold text-green-600">{stats.todayLogins}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <LogIn className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Access Denied</p>
                  <p className="text-2xl font-bold text-red-600">{stats.todayAccessDenied}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Records</p>
                  <p className="text-2xl font-bold text-slate-900">{pagination.total}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-full">
                  <Shield className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Select
                    label="Action"
                    options={actionOptions}
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                  />
                  <Select
                    label="Resource"
                    options={resourceOptions}
                    value={resourceFilter}
                    onChange={(e) => setResourceFilter(e.target.value)}
                  />
                  <Select
                    label="User Type"
                    options={userTypeOptions}
                    value={userTypeFilter}
                    onChange={(e) => setUserTypeFilter(e.target.value)}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Audit Logs Table */}
        <Table
          columns={columns}
          data={logs}
          keyExtractor={(log) => log.id.toString()}
        />

        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          />
        )}
      </div>

      {/* View Log Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Audit Log Details"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Timestamp</p>
                <p className="font-medium">{new Date(selectedLog.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">User</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">User #{selectedLog.userId}</span>
                  <Badge variant="secondary">{selectedLog.userType}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Action</p>
                <Badge variant={getActionVariant(selectedLog.action)} className="mt-1">
                  {selectedLog.action.replace("_", " ")}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500">Resource</p>
                <p className="font-medium capitalize">{selectedLog.resource.replace("_", " ")}</p>
                {selectedLog.resourceId && (
                  <p className="text-sm text-slate-500">ID: {selectedLog.resourceId}</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="p-3 bg-slate-50 rounded-lg text-slate-700">{selectedLog.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">IP Address</p>
                <p className="font-mono text-slate-700">{selectedLog.ipAddress || "Not recorded"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">User Agent</p>
                <p className="text-sm text-slate-600 truncate" title={selectedLog.userAgent || ""}>
                  {selectedLog.userAgent || "Not recorded"}
                </p>
              </div>
            </div>

            {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Additional Data</p>
                <pre className="p-3 bg-slate-50 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
