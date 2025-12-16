"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Select";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Video,
} from "lucide-react";

const appointmentsData = [
  {
    id: 1,
    patient: "John Smith",
    age: 45,
    date: "2024-01-20",
    time: "09:00 AM",
    type: "Consultation",
    symptoms: "Chest pain, shortness of breath",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Emily Davis",
    age: 32,
    date: "2024-01-20",
    time: "10:30 AM",
    type: "Follow-up",
    symptoms: "Blood pressure monitoring",
    status: "pending",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    age: 58,
    date: "2024-01-20",
    time: "11:00 AM",
    type: "Consultation",
    symptoms: "Irregular heartbeat",
    status: "completed",
  },
  {
    id: 4,
    patient: "Lisa Anderson",
    age: 27,
    date: "2024-01-21",
    time: "09:30 AM",
    type: "Emergency",
    symptoms: "Severe chest pain",
    status: "confirmed",
  },
  {
    id: 5,
    patient: "David Miller",
    age: 41,
    date: "2024-01-21",
    time: "02:00 PM",
    type: "Follow-up",
    symptoms: "Post-surgery checkup",
    status: "pending",
  },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
];

const dateOptions = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
  { value: "all", label: "All" },
];

export default function DoctorAppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("today");

  const filteredAppointments = appointmentsData.filter((apt) => {
    const matchesSearch = apt.patient
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "success" | "warning" | "info" | "secondary"
    > = {
      confirmed: "success",
      pending: "warning",
      completed: "info",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen">
      <Header title="My Appointments" subtitle="Manage your appointments" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Today</p>
              <p className="text-2xl font-bold text-slate-900">8</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Confirmed</p>
              <p className="text-2xl font-bold text-emerald-600">4</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-blue-600">1</p>
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
                    <Avatar fallback={apt.patient} size="lg" />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {apt.patient}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {apt.age} years old
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge
                          variant={
                            apt.type === "Emergency" ? "danger" : "secondary"
                          }
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
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </>
                    )}
                    {apt.status === "confirmed" && (
                      <>
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-1" />
                          Start Call
                        </Button>
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </>
                    )}
                    {apt.status === "completed" && (
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        View Record
                      </Button>
                    )}
                  </div>
                </div>

                {/* Symptoms */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">Symptoms:</span>{" "}
                    {apt.symptoms}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
