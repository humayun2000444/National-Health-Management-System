"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Table, Pagination, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Select";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import {
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  RefreshCw,
  Clock,
  User,
  Stethoscope,
  FileText,
  Trash2,
} from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string | null;
  createdAt: string;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  doctor: {
    id: string;
    name: string;
    specialization: string;
    department: {
      id: string;
      name: string;
    } | null;
  };
}

interface Department {
  id: string;
  name: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [statusFilter, departmentFilter, dateFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (departmentFilter !== "all")
        params.append("departmentId", departmentFilter);
      if (dateFilter) params.append("date", dateFilter);

      const [appointmentsRes, departmentsRes] = await Promise.all([
        fetch(`/api/admin/appointments?${params.toString()}`),
        fetch("/api/admin/departments"),
      ]);

      if (!appointmentsRes.ok) throw new Error("Failed to fetch appointments");
      if (!departmentsRes.ok) throw new Error("Failed to fetch departments");

      const [appointmentsData, departmentsData] = await Promise.all([
        appointmentsRes.json(),
        departmentsRes.json(),
      ]);

      setAppointments(appointmentsData);
      setDepartments(departmentsData);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (): Stats => {
    return {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };
  };

  const stats = calculateStats();

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const departmentOptions = [
    { value: "all", label: "All Departments" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    setSubmitting(true);
    setFormError("");
    try {
      const response = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appointmentId, status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update appointment");
      }

      fetchData();
      setIsStatusModalOpen(false);
      setSelectedAppointment(null);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to update appointment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    setSubmitting(true);
    setFormError("");
    try {
      const response = await fetch(
        `/api/admin/appointments?id=${selectedAppointment.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete appointment");
      }

      fetchData();
      setIsDeleteModalOpen(false);
      setSelectedAppointment(null);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to delete appointment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openViewModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const openStatusModal = (appointment: Appointment, status: string) => {
    setSelectedAppointment(appointment);
    setNewStatus(status);
    setFormError("");
    setIsStatusModalOpen(true);
  };

  const openDeleteModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormError("");
    setIsDeleteModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "success" | "warning" | "danger" | "info" | "secondary"
    > = {
      confirmed: "success",
      pending: "warning",
      completed: "info",
      cancelled: "danger",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const columns: Column<Appointment>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (apt) => (
        <div className="flex items-center gap-3">
          <Avatar fallback={apt.patient.name} size="sm" />
          <div>
            <p className="font-medium text-slate-900">{apt.patient.name}</p>
            <p className="text-sm text-slate-500">{apt.patient.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "doctor",
      header: "Doctor",
      render: (apt) => (
        <div>
          <p className="font-medium text-slate-900">{apt.doctor.name}</p>
          <p className="text-sm text-slate-500">
            {apt.doctor.department?.name || apt.doctor.specialization}
          </p>
        </div>
      ),
    },
    {
      key: "dateTime",
      header: "Date & Time",
      render: (apt) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{formatDate(apt.date)}</p>
            <p className="text-sm text-slate-500">{apt.time}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (apt) => (
        <Badge variant={apt.type === "emergency" ? "danger" : "secondary"}>
          {apt.type.charAt(0).toUpperCase() + apt.type.slice(1)}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (apt) => getStatusBadge(apt.status),
    },
    {
      key: "actions",
      header: "Actions",
      render: (apt) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openViewModal(apt)}>
            <Eye className="h-4 w-4" />
          </Button>
          {apt.status === "pending" && (
            <>
              <button
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                onClick={() => openStatusModal(apt, "confirmed")}
                title="Confirm"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                onClick={() => openStatusModal(apt, "cancelled")}
                title="Cancel"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          {apt.status === "confirmed" && (
            <button
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => openStatusModal(apt, "completed")}
              title="Mark as Completed"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          <button
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            onClick={() => openDeleteModal(apt)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Appointments" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header title="Appointments" subtitle="Error loading data" />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Appointments"
        subtitle={`${appointments.length} total appointments`}
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.completed}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-36">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
            <div className="w-44">
              <Select
                options={departmentOptions}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by date"
              />
            </div>
          </div>
          <Button variant="outline" onClick={() => setDateFilter("")}>
            Clear Filters
          </Button>
        </div>

        {/* Appointments Table */}
        {filteredAppointments.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={paginatedAppointments}
              keyExtractor={(apt) => apt.id}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAppointments.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No appointments found</p>
            <p className="text-sm text-slate-400">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>

      {/* View Appointment Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {formatDate(selectedAppointment.date)}
                  </p>
                  <p className="text-slate-500">{selectedAppointment.time}</p>
                </div>
              </div>
              {getStatusBadge(selectedAppointment.status)}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <p className="font-medium text-slate-700">Patient</p>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {selectedAppointment.patient.name}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedAppointment.patient.email}
                </p>
                {selectedAppointment.patient.phone && (
                  <p className="text-sm text-slate-500">
                    {selectedAppointment.patient.phone}
                  </p>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="h-5 w-5 text-slate-400" />
                  <p className="font-medium text-slate-700">Doctor</p>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {selectedAppointment.doctor.name}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedAppointment.doctor.specialization}
                </p>
                {selectedAppointment.doctor.department && (
                  <p className="text-sm text-slate-500">
                    {selectedAppointment.doctor.department.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Appointment Type</p>
                <p className="font-medium">
                  {selectedAppointment.type.charAt(0).toUpperCase() +
                    selectedAppointment.type.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Created</p>
                <p className="font-medium">
                  {new Date(selectedAppointment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <p className="text-sm text-slate-500">Notes</p>
                </div>
                <p className="p-3 bg-slate-50 rounded-lg text-slate-700">
                  {selectedAppointment.notes}
                </p>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
          {selectedAppointment?.status === "pending" && (
            <>
              <Button
                variant="danger"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openStatusModal(selectedAppointment, "cancelled");
                }}
              >
                Cancel Appointment
              </Button>
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  openStatusModal(selectedAppointment, "confirmed");
                }}
              >
                Confirm Appointment
              </Button>
            </>
          )}
          {selectedAppointment?.status === "confirmed" && (
            <Button
              onClick={() => {
                setIsViewModalOpen(false);
                openStatusModal(selectedAppointment, "completed");
              }}
            >
              Mark as Completed
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={`${
          newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
        } Appointment`}
        size="sm"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <p className="text-slate-600">
            Are you sure you want to{" "}
            {newStatus === "confirmed"
              ? "confirm"
              : newStatus === "completed"
              ? "mark as completed"
              : "cancel"}{" "}
            this appointment for{" "}
            <span className="font-semibold">
              {selectedAppointment?.patient.name}
            </span>{" "}
            with{" "}
            <span className="font-semibold">
              {selectedAppointment?.doctor.name}
            </span>
            ?
          </p>
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsStatusModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant={newStatus === "cancelled" ? "danger" : "primary"}
            onClick={() =>
              selectedAppointment &&
              handleUpdateStatus(selectedAppointment.id, newStatus)
            }
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              `${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Appointment"
        size="sm"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <p className="text-slate-600">
            Are you sure you want to delete the appointment for{" "}
            <span className="font-semibold">
              {selectedAppointment?.patient.name}
            </span>{" "}
            on{" "}
            <span className="font-semibold">
              {selectedAppointment && formatDate(selectedAppointment.date)}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAppointment}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Appointment"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
