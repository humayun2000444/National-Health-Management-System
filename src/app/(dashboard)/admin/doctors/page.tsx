"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Edit,
  Trash2,
} from "lucide-react";

// Sample doctors data
const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@hospital.com",
    phone: "+1 234 567 8901",
    specialization: "Cardiology",
    department: "Cardiology",
    experience: 12,
    patients: 48,
    status: "active",
    avatar: null,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "michael.chen@hospital.com",
    phone: "+1 234 567 8902",
    specialization: "Neurology",
    department: "Neurology",
    experience: 8,
    patients: 42,
    status: "active",
    avatar: null,
  },
  {
    id: 3,
    name: "Dr. James Brown",
    email: "james.brown@hospital.com",
    phone: "+1 234 567 8903",
    specialization: "Orthopedics",
    department: "Orthopedics",
    experience: 15,
    patients: 38,
    status: "active",
    avatar: null,
  },
  {
    id: 4,
    name: "Dr. Emily Parker",
    email: "emily.parker@hospital.com",
    phone: "+1 234 567 8904",
    specialization: "Pediatrics",
    department: "Pediatrics",
    experience: 6,
    patients: 35,
    status: "inactive",
    avatar: null,
  },
  {
    id: 5,
    name: "Dr. Robert Kim",
    email: "robert.kim@hospital.com",
    phone: "+1 234 567 8905",
    specialization: "Dermatology",
    department: "Dermatology",
    experience: 10,
    patients: 52,
    status: "active",
    avatar: null,
  },
];

const departments = [
  { value: "", label: "All Departments" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "dermatology", label: "Dermatology" },
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      !selectedDepartment ||
      doctor.department.toLowerCase() === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen">
      <Header title="Doctors" subtitle="Manage hospital doctors" />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-48">
              <Select
                options={departments}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                placeholder="All Departments"
              />
            </div>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar fallback={doctor.name} size="lg" />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={doctor.status === "active" ? "success" : "secondary"}
                  >
                    {doctor.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4" />
                    {doctor.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    {doctor.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex gap-4 text-sm">
                    <span className="text-slate-500">
                      <strong className="text-slate-900">{doctor.experience}</strong>{" "}
                      years exp.
                    </span>
                    <span className="text-slate-500">
                      <strong className="text-slate-900">{doctor.patients}</strong>{" "}
                      patients
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No doctors found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Doctor"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Dr. John Doe" />
            <Input label="Email" type="email" placeholder="john@hospital.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" placeholder="+1 234 567 8900" />
            <Select
              label="Department"
              options={departments.slice(1)}
              placeholder="Select department"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Specialization" placeholder="e.g., Cardiology" />
            <Input label="Experience (years)" type="number" placeholder="5" />
          </div>
          <Input label="Qualification" placeholder="e.g., MBBS, MD" />
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
          <Button>Add Doctor</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
