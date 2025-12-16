"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Table, Pagination, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Select";
import { Search, Filter, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

interface Appointment {
  id: number;
  patient: string;
  patientEmail: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

const appointmentsData: Appointment[] = [
  {
    id: 1,
    patient: "John Smith",
    patientEmail: "john.smith@email.com",
    doctor: "Dr. Sarah Wilson",
    department: "Cardiology",
    date: "2024-01-20",
    time: "09:00 AM",
    type: "Consultation",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Emily Davis",
    patientEmail: "emily.davis@email.com",
    doctor: "Dr. Michael Chen",
    department: "Neurology",
    date: "2024-01-20",
    time: "10:30 AM",
    type: "Follow-up",
    status: "pending",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    patientEmail: "robert.j@email.com",
    doctor: "Dr. Sarah Wilson",
    department: "Cardiology",
    date: "2024-01-20",
    time: "11:00 AM",
    type: "Consultation",
    status: "completed",
  },
  {
    id: 4,
    patient: "Lisa Anderson",
    patientEmail: "lisa.a@email.com",
    doctor: "Dr. James Brown",
    department: "Orthopedics",
    date: "2024-01-20",
    time: "02:00 PM",
    type: "Emergency",
    status: "cancelled",
  },
  {
    id: 5,
    patient: "David Miller",
    patientEmail: "david.m@email.com",
    doctor: "Dr. Michael Chen",
    department: "Neurology",
    date: "2024-01-21",
    time: "03:30 PM",
    type: "Consultation",
    status: "confirmed",
  },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const departmentOptions = [
  { value: "", label: "All Departments" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
];

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAppointments = appointmentsData.filter((apt) => {
    const matchesSearch =
      apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || apt.status === statusFilter;
    const matchesDepartment =
      !departmentFilter ||
      apt.department.toLowerCase() === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "danger" | "info" | "secondary"> = {
      confirmed: "success",
      pending: "warning",
      completed: "info",
      cancelled: "danger",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const columns: Column<Appointment>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (apt) => (
        <div className="flex items-center gap-3">
          <Avatar fallback={apt.patient} size="sm" />
          <div>
            <p className="font-medium text-slate-900">{apt.patient}</p>
            <p className="text-sm text-slate-500">{apt.patientEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: "doctor",
      header: "Doctor",
      render: (apt) => (
        <div>
          <p className="font-medium text-slate-900">{apt.doctor}</p>
          <p className="text-sm text-slate-500">{apt.department}</p>
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
            <p className="font-medium text-slate-900">
              {new Date(apt.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-slate-500">{apt.time}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (apt) => (
        <Badge
          variant={apt.type === "Emergency" ? "danger" : "secondary"}
        >
          {apt.type}
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
          {apt.status === "pending" && (
            <>
              <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                <CheckCircle className="h-4 w-4" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Header title="Appointments" subtitle="Manage hospital appointments" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">Total Today</p>
            <p className="text-2xl font-bold text-slate-900">24</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">8</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-600">12</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-blue-600">4</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-40">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Select
                options={departmentOptions}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <Table
          columns={columns}
          data={filteredAppointments}
          keyExtractor={(apt) => apt.id}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          totalItems={appointmentsData.length}
          itemsPerPage={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
