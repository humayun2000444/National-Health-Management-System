"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import {
  Plus,
  Search,
  Users,
  Stethoscope,
  Edit,
  Trash2,
  Heart,
  Brain,
  Bone,
  Baby,
  Eye as EyeIcon,
} from "lucide-react";

const departmentsData = [
  {
    id: 1,
    name: "Cardiology",
    description: "Heart and cardiovascular system care",
    icon: "heart",
    doctors: 8,
    patients: 245,
    status: "active",
  },
  {
    id: 2,
    name: "Neurology",
    description: "Brain and nervous system disorders",
    icon: "brain",
    doctors: 6,
    patients: 189,
    status: "active",
  },
  {
    id: 3,
    name: "Orthopedics",
    description: "Bones, joints, and muscles treatment",
    icon: "bone",
    doctors: 5,
    patients: 156,
    status: "active",
  },
  {
    id: 4,
    name: "Pediatrics",
    description: "Medical care for infants and children",
    icon: "baby",
    doctors: 7,
    patients: 312,
    status: "active",
  },
  {
    id: 5,
    name: "Ophthalmology",
    description: "Eye and vision care",
    icon: "eye",
    doctors: 4,
    patients: 98,
    status: "inactive",
  },
];

const iconComponents: Record<string, React.ReactNode> = {
  heart: <Heart className="h-6 w-6" />,
  brain: <Brain className="h-6 w-6" />,
  bone: <Bone className="h-6 w-6" />,
  baby: <Baby className="h-6 w-6" />,
  eye: <EyeIcon className="h-6 w-6" />,
};

const iconColors: Record<string, string> = {
  heart: "bg-red-100 text-red-600",
  brain: "bg-purple-100 text-purple-600",
  bone: "bg-amber-100 text-amber-600",
  baby: "bg-pink-100 text-pink-600",
  eye: "bg-cyan-100 text-cyan-600",
};

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredDepartments = departmentsData.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header title="Departments" subtitle="Manage hospital departments" />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${iconColors[dept.icon] || "bg-slate-100 text-slate-600"}`}
                  >
                    {iconComponents[dept.icon] || (
                      <Stethoscope className="h-6 w-6" />
                    )}
                  </div>
                  <Badge
                    variant={dept.status === "active" ? "success" : "secondary"}
                  >
                    {dept.status}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {dept.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  {dept.description}
                </p>

                <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Stethoscope className="h-4 w-4" />
                    <span>{dept.doctors} doctors</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4" />
                    <span>{dept.patients} patients</span>
                  </div>
                </div>

                <div className="flex justify-end gap-1 mt-4">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No departments found.</p>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Department"
        size="md"
      >
        <div className="space-y-4">
          <Input label="Department Name" placeholder="e.g., Cardiology" />
          <Input
            label="Description"
            placeholder="Brief description of the department"
          />
          <Input label="Icon" placeholder="e.g., heart, brain, bone" hint="Available icons: heart, brain, bone, baby, eye" />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button>Add Department</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
