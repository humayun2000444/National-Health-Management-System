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
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";

interface Appointment {
  id: number;
  patient: string;
  patientId: number;
  patientAvatar: string | null;
  age: number | null;
  gender: string | null;
  phone: string | null;
  date: string;
  time: string;
  endTime: string;
  type: string;
  status: string;
  symptoms: string | null;
  notes: string | null;
  diagnosis: string | null;
  department: string | null;
}

interface Stats {
  today: number;
  pending: number;
  confirmed: number;
  completed: number;
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const dateOptions = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
  { value: "all", label: "All" },
];

export default function DoctorAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({ today: 0, pending: 0, confirmed: 0, completed: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [completeModal, setCompleteModal] = useState<Appointment | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (dateFilter) params.append("date", dateFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/doctor/appointments?${params}`);
      if (!response.ok) throw new Error("Failed to fetch appointments");

      const data = await response.json();
      setAppointments(data.appointments);
      setStats(data.stats);
    } catch (err) {
      setError("Failed to load appointments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAppointments();
  };

  const updateStatus = async (appointmentId: number, status: string) => {
    setUpdatingId(appointmentId);
    try {
      const response = await fetch("/api/doctor/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status }),
      });

      if (!response.ok) throw new Error("Failed to update");
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleComplete = async () => {
    if (!completeModal) return;

    setUpdatingId(completeModal.id);
    try {
      const response = await fetch("/api/doctor/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: completeModal.id,
          status: "completed",
          diagnosis,
          notes,
        }),
      });

      if (!response.ok) throw new Error("Failed to complete");
      setCompleteModal(null);
      setDiagnosis("");
      setNotes("");
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) =>
    apt.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "info" | "secondary" | "danger"> = {
      confirmed: "success",
      pending: "warning",
      completed: "info",
      cancelled: "danger",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="My Appointments" subtitle="Manage your appointments" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="My Appointments" subtitle="Manage your appointments" />

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Today</p>
              <p className="text-2xl font-bold text-slate-900">{stats.today}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Confirmed</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.confirmed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Completed Today</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex gap-2">
            <Select
              options={dateOptions}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <Card key={apt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={apt.patientAvatar || undefined}
                      fallback={apt.patient}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {apt.patient}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {apt.age ? `${apt.age} years old` : "Age N/A"}
                        {apt.gender && `, ${apt.gender}`}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge
                          variant={apt.type === "Emergency" ? "danger" : "secondary"}
                          size="sm"
                        >
                          {apt.type}
                        </Badge>
                        {getStatusBadge(apt.status)}
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {new Date(apt.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{apt.time}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {apt.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(apt.id, "cancelled")}
                          disabled={updatingId === apt.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(apt.id, "confirmed")}
                          disabled={updatingId === apt.id}
                        >
                          {updatingId === apt.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          Accept
                        </Button>
                      </>
                    )}
                    {apt.status === "confirmed" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setCompleteModal(apt);
                            setDiagnosis(apt.diagnosis || "");
                            setNotes(apt.notes || "");
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      </>
                    )}
                    {apt.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAppointment(apt)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Record
                      </Button>
                    )}
                  </div>
                </div>

                {/* Symptoms */}
                {apt.symptoms && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                      <span className="font-medium text-slate-700">Symptoms:</span>{" "}
                      {apt.symptoms}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No appointments found.</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar
                src={selectedAppointment.patientAvatar || undefined}
                fallback={selectedAppointment.patient}
                size="xl"
              />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {selectedAppointment.patient}
                </h3>
                <p className="text-slate-500">
                  {selectedAppointment.age ? `${selectedAppointment.age} years old` : ""}
                  {selectedAppointment.gender && `, ${selectedAppointment.gender}`}
                </p>
                {getStatusBadge(selectedAppointment.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-semibold text-slate-900">
                  {new Date(selectedAppointment.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Time</p>
                <p className="font-semibold text-slate-900">
                  {selectedAppointment.time} - {selectedAppointment.endTime}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Type</p>
                <p className="font-semibold text-slate-900">
                  {selectedAppointment.type}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-semibold text-slate-900">
                  {selectedAppointment.phone || "N/A"}
                </p>
              </div>
            </div>

            {selectedAppointment.symptoms && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm font-medium text-amber-800">Symptoms</p>
                <p className="text-amber-700">{selectedAppointment.symptoms}</p>
              </div>
            )}

            {selectedAppointment.diagnosis && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Diagnosis</p>
                <p className="text-blue-700">{selectedAppointment.diagnosis}</p>
              </div>
            )}

            {selectedAppointment.notes && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Notes</p>
                <p className="text-slate-600">{selectedAppointment.notes}</p>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Complete Appointment Modal */}
      <Modal
        isOpen={!!completeModal}
        onClose={() => setCompleteModal(null)}
        title="Complete Appointment"
        size="lg"
      >
        {completeModal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Avatar
                src={completeModal.patientAvatar || undefined}
                fallback={completeModal.patient}
                size="md"
              />
              <div>
                <p className="font-medium text-slate-900">{completeModal.patient}</p>
                <p className="text-sm text-slate-500">{completeModal.type}</p>
              </div>
            </div>

            {completeModal.symptoms && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Symptoms:</span> {completeModal.symptoms}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Diagnosis
              </label>
              <textarea
                rows={3}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter diagnosis..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
              />
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setCompleteModal(null)}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={updatingId !== null}>
            {updatingId ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Mark as Completed
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
