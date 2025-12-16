"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
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
  Loader2,
  RefreshCw,
  Activity,
  Pill,
  Thermometer,
  Microscope,
  Syringe,
  Building2,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  status: string;
  createdAt: string;
  _count: {
    doctors: number;
  };
}

interface FormData {
  name: string;
  description: string;
  icon: string;
  status: string;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  icon: "stethoscope",
  status: "active",
};

const iconOptions = [
  { value: "heart", label: "Heart" },
  { value: "brain", label: "Brain" },
  { value: "bone", label: "Bone" },
  { value: "baby", label: "Baby/Pediatrics" },
  { value: "eye", label: "Eye" },
  { value: "stethoscope", label: "Stethoscope" },
  { value: "activity", label: "Activity/General" },
  { value: "pill", label: "Pill/Pharmacy" },
  { value: "thermometer", label: "Thermometer" },
  { value: "microscope", label: "Microscope/Lab" },
  { value: "syringe", label: "Syringe" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const iconComponents: Record<string, React.ReactNode> = {
  heart: <Heart className="h-6 w-6" />,
  brain: <Brain className="h-6 w-6" />,
  bone: <Bone className="h-6 w-6" />,
  baby: <Baby className="h-6 w-6" />,
  eye: <EyeIcon className="h-6 w-6" />,
  stethoscope: <Stethoscope className="h-6 w-6" />,
  activity: <Activity className="h-6 w-6" />,
  pill: <Pill className="h-6 w-6" />,
  thermometer: <Thermometer className="h-6 w-6" />,
  microscope: <Microscope className="h-6 w-6" />,
  syringe: <Syringe className="h-6 w-6" />,
};

const iconColors: Record<string, string> = {
  heart: "bg-red-100 text-red-600",
  brain: "bg-purple-100 text-purple-600",
  bone: "bg-amber-100 text-amber-600",
  baby: "bg-pink-100 text-pink-600",
  eye: "bg-cyan-100 text-cyan-600",
  stethoscope: "bg-blue-100 text-blue-600",
  activity: "bg-emerald-100 text-emerald-600",
  pill: "bg-orange-100 text-orange-600",
  thermometer: "bg-rose-100 text-rose-600",
  microscope: "bg-indigo-100 text-indigo-600",
  syringe: "bg-teal-100 text-teal-600",
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/departments");
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError("Failed to load departments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setFormError("Department name is required");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleAddDepartment = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          icon: formData.icon || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create department");
      }

      setIsAddModalOpen(false);
      setFormData(initialFormData);
      fetchDepartments();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to add department"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDepartment = async () => {
    if (!selectedDepartment || !validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/departments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedDepartment.id,
          name: formData.name,
          description: formData.description || null,
          icon: formData.icon || null,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update department");
      }

      setIsEditModalOpen(false);
      setSelectedDepartment(null);
      setFormData(initialFormData);
      fetchDepartments();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to update department"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/departments?id=${selectedDepartment.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete department");
      }

      setIsDeleteModalOpen(false);
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to delete department"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
      icon: department.icon || "stethoscope",
      status: department.status,
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (department: Department) => {
    setSelectedDepartment(department);
    setFormError("");
    setIsDeleteModalOpen(true);
  };

  const totalDoctors = departments.reduce(
    (sum, dept) => sum + dept._count.doctors,
    0
  );
  const activeDepartments = departments.filter(
    (d) => d.status === "active"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Departments" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header title="Departments" subtitle="Error loading data" />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchDepartments} className="flex items-center gap-2">
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
        title="Departments"
        subtitle={`${departments.length} departments`}
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Departments</p>
                <p className="text-2xl font-bold text-slate-900">
                  {departments.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Departments</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {activeDepartments}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Stethoscope className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Doctors</p>
                <p className="text-2xl font-bold text-violet-600">
                  {totalDoctors}
                </p>
              </div>
            </div>
          </div>
        </div>

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
          <Button
            onClick={() => {
              setFormData(initialFormData);
              setFormError("");
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>

        {/* Departments Grid */}
        {filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <Card key={dept.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        iconColors[dept.icon || "stethoscope"] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {iconComponents[dept.icon || "stethoscope"] || (
                        <Stethoscope className="h-6 w-6" />
                      )}
                    </div>
                    <Badge
                      variant={
                        dept.status === "active" ? "success" : "secondary"
                      }
                    >
                      {dept.status}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {dept.description || "No description available"}
                  </p>

                  <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Stethoscope className="h-4 w-4" />
                      <span>{dept._count.doctors} doctors</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-1 mt-4">
                    <button
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => openEditModal(dept)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => openDeleteModal(dept)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Building2 className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No departments found</p>
            <p className="text-sm text-slate-400">
              {searchQuery
                ? "Try adjusting your search query"
                : "Click 'Add Department' to create one"}
            </p>
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
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <Input
            label="Department Name"
            name="name"
            placeholder="e.g., Cardiology"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Description"
            name="description"
            placeholder="Brief description of the department"
            value={formData.description}
            onChange={handleInputChange}
          />
          <Select
            label="Icon"
            name="icon"
            options={iconOptions}
            value={formData.icon}
            onChange={handleInputChange}
          />
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-500">Preview:</span>
            <div
              className={`p-2 rounded-lg ${
                iconColors[formData.icon] || "bg-slate-100 text-slate-600"
              }`}
            >
              {iconComponents[formData.icon] || (
                <Stethoscope className="h-5 w-5" />
              )}
            </div>
            <span className="font-medium">{formData.name || "Department"}</span>
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsAddModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleAddDepartment} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Department"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Department"
        size="md"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <Input
            label="Department Name"
            name="name"
            placeholder="e.g., Cardiology"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Description"
            name="description"
            placeholder="Brief description of the department"
            value={formData.description}
            onChange={handleInputChange}
          />
          <Select
            label="Icon"
            name="icon"
            options={iconOptions}
            value={formData.icon}
            onChange={handleInputChange}
          />
          <Select
            label="Status"
            name="status"
            options={statusOptions}
            value={formData.status}
            onChange={handleInputChange}
          />
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-500">Preview:</span>
            <div
              className={`p-2 rounded-lg ${
                iconColors[formData.icon] || "bg-slate-100 text-slate-600"
              }`}
            >
              {iconComponents[formData.icon] || (
                <Stethoscope className="h-5 w-5" />
              )}
            </div>
            <span className="font-medium">{formData.name || "Department"}</span>
            <Badge
              variant={formData.status === "active" ? "success" : "secondary"}
            >
              {formData.status}
            </Badge>
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleEditDepartment} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Department"
        size="sm"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          {selectedDepartment && selectedDepartment._count.doctors > 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 font-medium">Cannot Delete</p>
              <p className="text-sm text-amber-700 mt-1">
                This department has {selectedDepartment._count.doctors} doctor(s)
                assigned. Please reassign or remove the doctors before deleting
                this department.
              </p>
            </div>
          ) : (
            <p className="text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedDepartment?.name}</span>?
              This action cannot be undone.
            </p>
          )}
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          {selectedDepartment && selectedDepartment._count.doctors === 0 && (
            <Button
              variant="danger"
              onClick={handleDeleteDepartment}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Department"
              )}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
