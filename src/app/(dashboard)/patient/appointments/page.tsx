"use client";

import { useState } from "react";
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
} from "lucide-react";

const appointmentsData = [
  {
    id: 1,
    doctor: "Dr. Sarah Wilson",
    specialization: "Cardiology",
    date: "2024-01-25",
    time: "10:00 AM",
    type: "Consultation",
    status: "confirmed",
    location: "Room 205, Building A",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialization: "Neurology",
    date: "2024-02-05",
    time: "02:30 PM",
    type: "Follow-up",
    status: "pending",
    location: "Room 301, Building B",
  },
  {
    id: 3,
    doctor: "Dr. Sarah Wilson",
    specialization: "Cardiology",
    date: "2024-01-10",
    time: "11:00 AM",
    type: "Consultation",
    status: "completed",
    location: "Room 205, Building A",
  },
  {
    id: 4,
    doctor: "Dr. James Brown",
    specialization: "Orthopedics",
    date: "2024-01-05",
    time: "09:30 AM",
    type: "Follow-up",
    status: "completed",
    location: "Room 102, Building A",
  },
];

const filterOptions = [
  { value: "all", label: "All Appointments" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function PatientAppointmentsPage() {
  const [filter, setFilter] = useState("all");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );

  const filteredAppointments = appointmentsData.filter((apt) => {
    if (filter === "all") return true;
    if (filter === "upcoming")
      return apt.status === "confirmed" || apt.status === "pending";
    return apt.status === filter;
  });

  const upcomingCount = appointmentsData.filter(
    (a) => a.status === "confirmed" || a.status === "pending"
  ).length;
  const completedCount = appointmentsData.filter(
    (a) => a.status === "completed"
  ).length;

  return (
    <div className="min-h-screen">
      <Header title="My Appointments" subtitle="View and manage your appointments" />

      <div className="p-6">
        {/* Stats & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-600">
                <strong className="text-lg">{upcomingCount}</strong> Upcoming
              </span>
            </div>
            <div className="px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-sm text-emerald-600">
                <strong className="text-lg">{completedCount}</strong> Completed
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
                    <Avatar fallback={apt.doctor} size="lg" />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {apt.doctor}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {apt.specialization}
                      </p>
                      <Badge
                        variant={
                          apt.type === "Consultation" ? "secondary" : "info"
                        }
                        size="sm"
                        className="mt-1"
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
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Report
                      </Button>
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
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
      >
        <p className="text-slate-600">
          Are you sure you want to cancel this appointment? This action cannot
          be undone.
        </p>
        <ModalFooter>
          <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
            Keep Appointment
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              // Handle cancellation
              setCancelModalOpen(false);
            }}
          >
            Cancel Appointment
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
