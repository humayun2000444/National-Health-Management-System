"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Table, Pagination, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Plus, Search, Download, Eye } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  bloodGroup: string;
  lastVisit: string;
  status: string;
}

const patientsData: Patient[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 234 567 8901",
    gender: "Male",
    age: 45,
    bloodGroup: "A+",
    lastVisit: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 234 567 8902",
    gender: "Female",
    age: 32,
    bloodGroup: "B+",
    lastVisit: "2024-01-14",
    status: "active",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.j@email.com",
    phone: "+1 234 567 8903",
    gender: "Male",
    age: 58,
    bloodGroup: "O-",
    lastVisit: "2024-01-12",
    status: "inactive",
  },
  {
    id: 4,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+1 234 567 8904",
    gender: "Female",
    age: 27,
    bloodGroup: "AB+",
    lastVisit: "2024-01-10",
    status: "active",
  },
  {
    id: 5,
    name: "David Miller",
    email: "david.m@email.com",
    phone: "+1 234 567 8905",
    gender: "Male",
    age: 41,
    bloodGroup: "A-",
    lastVisit: "2024-01-08",
    status: "active",
  },
];

const bloodGroups = [
  { value: "", label: "All Blood Groups" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const genderOptions = [
  { value: "", label: "All Genders" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPatients = patientsData.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodGroup =
      !bloodGroupFilter || patient.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesBloodGroup;
  });

  const columns: Column<Patient>[] = [
    {
      key: "name",
      header: "Patient",
      render: (patient) => (
        <div className="flex items-center gap-3">
          <Avatar fallback={patient.name} size="sm" />
          <div>
            <p className="font-medium text-slate-900">{patient.name}</p>
            <p className="text-sm text-slate-500">{patient.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "gender",
      header: "Gender",
    },
    {
      key: "age",
      header: "Age",
      render: (patient) => `${patient.age} years`,
    },
    {
      key: "bloodGroup",
      header: "Blood Group",
      render: (patient) => (
        <Badge variant="primary">{patient.bloodGroup}</Badge>
      ),
    },
    {
      key: "lastVisit",
      header: "Last Visit",
      render: (patient) =>
        new Date(patient.lastVisit).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      key: "status",
      header: "Status",
      render: (patient) => (
        <Badge variant={patient.status === "active" ? "success" : "secondary"}>
          {patient.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (patient) => (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Header title="Patients" subtitle="Manage hospital patients" />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-48">
              <Select
                options={bloodGroups}
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Patients Table */}
        <Table
          columns={columns}
          data={filteredPatients}
          keyExtractor={(patient) => patient.id}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          totalItems={patientsData.length}
          itemsPerPage={10}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Patient"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="John Doe" />
            <Input label="Email" type="email" placeholder="john@email.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" placeholder="+1 234 567 8900" />
            <Input label="Date of Birth" type="date" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Gender" options={genderOptions.slice(1)} placeholder="Select gender" />
            <Select label="Blood Group" options={bloodGroups.slice(1)} placeholder="Select blood group" />
          </div>
          <Input label="Address" placeholder="123 Main St, City, Country" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Emergency Contact" placeholder="Jane Doe" />
            <Input label="Emergency Phone" placeholder="+1 234 567 8900" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Password" type="password" placeholder="Enter password" />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button>Add Patient</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
