"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Select";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import {
  Calendar,
  Clock,
  Plus,
  XCircle,
  Video,
  MapPin,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Appointment {
  id: number;
  doctor: string;
  specialization: string;
  avatar: string | null;
  department: string;
  date: string;
  time: string;
  endTime: string;
  type: string;
  status: string;
  location: string;
  symptoms: string | null;
  notes: string | null;
}

interface AppointmentCounts {
  upcoming: number;
  completed: number;
  cancelled: number;
  total: number;
}

const filterOptions = [
  { value: "all", label: "All Appointments" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counts, setCounts] = useState<AppointmentCounts>({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/patient/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data.appointments);
      setCounts(data.counts);
    } catch (err) {
      setError("Failed to load appointments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    setCancelling(true);
    try {
      const response = await fetch("/api/patient/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedAppointment,
          action: "cancel",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel appointment");
      }

      // Refresh appointments list
      await fetchAppointments();
      setCancelModalOpen(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to cancel appointment");
    } finally {
      setCancelling(false);
    }
  };

  // Filter appointments locally
  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    if (filter === "upcoming") {
      return (
        (apt.status === "confirmed" || apt.status === "pending") &&
        new Date(apt.date) >= new Date(new Date().toDateString())
      );
    }
    return apt.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="My Appointments"
          subtitle="View and manage your appointments"
        />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="My Appointments"
          subtitle="View and manage your appointments"
        />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchAppointments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="My Appointments"
        subtitle="View and manage your appointments"
      />

      <div className="p-6">
        {/* Stats & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-600">
                <strong className="text-lg">{counts.upcoming}</strong> Upcoming
              </span>
            </div>
            <div className="px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-sm text-emerald-600">
                <strong className="text-lg">{counts.completed}</strong> Completed
              </span>
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-lg">
              <span className="text-sm text-red-600">
                <strong className="text-lg">{counts.cancelled}</strong> Cancelled
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              options={filterOptions}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Link href="/patient/book">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Book New
              </Button>
            </Link>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={apt.avatar || undefined}
                      fallback={apt.doctor}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {apt.doctor}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {apt.specialization}
                      </p>
                      <Badge
                        variant={
                          apt.type === "consultation" ? "secondary" : "info"
                        }
                        size="sm"
                        className="mt-1 capitalize"
                      >
                        {apt.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(apt.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{apt.location}</span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        apt.status === "confirmed"
                          ? "success"
                          : apt.status === "pending"
                          ? "warning"
                          : apt.status === "completed"
                          ? "info"
                          : "danger"
                      }
                      className="capitalize"
                    >
                      {apt.status}
                    </Badge>

                    {(apt.status === "confirmed" ||
                      apt.status === "pending") && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Join Call
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedAppointment(apt.id);
                            setCancelModalOpen(true);
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {apt.status === "completed" && (
                      <Link href={`/patient/records?appointmentId=${apt.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No appointments found</p>
            <Link href="/patient/book">
              <Button className="mt-4">Book an Appointment</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => {
          if (!cancelling) {
            setCancelModalOpen(false);
            setSelectedAppointment(null);
          }
        }}
        title="Cancel Appointment"
      >
        <p className="text-slate-600">
          Are you sure you want to cancel this appointment? This action cannot
          be undone.
        </p>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setCancelModalOpen(false);
              setSelectedAppointment(null);
            }}
            disabled={cancelling}
          >
            Keep Appointment
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelAppointment}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Appointment"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
