"use client";

import { useState, useEffect } from "react";
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
  Mail,
  Phone,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  status: string;
  image: string | null;
  department: Department | null;
  departmentId: string | null;
  _count?: {
    appointments: number;
    prescriptions: number;
  };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: string;
  consultationFee: string;
  departmentId: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  qualification: "",
  experience: "",
  consultationFee: "",
  departmentId: "",
  password: "",
  confirmPassword: "",
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [doctorsRes, deptsRes] = await Promise.all([
        fetch("/api/admin/doctors"),
        fetch("/api/admin/departments"),
      ]);

      if (!doctorsRes.ok) throw new Error("Failed to fetch doctors");
      if (!deptsRes.ok) throw new Error("Failed to fetch departments");

      const doctorsData = await doctorsRes.json();
      const deptsData = await deptsRes.json();

      setDoctors(doctorsData);
      setDepartments(deptsData);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDoctor = async () => {
    setFormError("");

    if (!formData.name || !formData.email || !formData.password) {
      setFormError("Name, email, and password are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add doctor");
      }

      await fetchData();
      setIsAddModalOpen(false);
      setFormData(initialFormData);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to add doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDoctor = async () => {
    if (!selectedDoctor) return;
    setFormError("");

    if (!formData.name || !formData.email) {
      setFormError("Name and email are required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/doctors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedDoctor.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update doctor");
      }

      await fetchData();
      setIsEditModalOpen(false);
      setSelectedDoctor(null);
      setFormData(initialFormData);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to update doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/doctors?id=${selectedDoctor.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete doctor");
      }

      await fetchData();
      setIsDeleteModalOpen(false);
      setSelectedDoctor(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to delete doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone || "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience?.toString() || "",
      consultationFee: doctor.consultationFee?.toString() || "",
      departmentId: doctor.departmentId || "",
      password: "",
      confirmPassword: "",
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormError("");
    setIsDeleteModalOpen(true);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || doctor.departmentId === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departmentOptions = [
    { value: "", label: "All Departments" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Doctors" subtitle="Manage hospital doctors" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header title="Doctors" subtitle="Manage hospital doctors" />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                options={departmentOptions}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={() => { setFormData(initialFormData); setFormError(""); setIsAddModalOpen(true); }}>
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
                        {doctor.specialization || "General"}
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
                  {doctor.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4" />
                      {doctor.phone}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex gap-4 text-sm">
                    <span className="text-slate-500">
                      <strong className="text-slate-900">{doctor.experience || 0}</strong>{" "}
                      years exp.
                    </span>
                    <span className="text-slate-500">
                      <strong className="text-slate-900">{doctor._count?.appointments || 0}</strong>{" "}
                      appointments
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(doctor)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(doctor)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
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
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Dr. John Doe"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@hospital.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 234 567 8900"
            />
            <Select
              label="Department"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="e.g., Cardiology"
            />
            <Input
              label="Experience (years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              placeholder="e.g., MBBS, MD"
            />
            <Input
              label="Consultation Fee ($)"
              name="consultationFee"
              type="number"
              value={formData.consultationFee}
              onChange={handleInputChange}
              placeholder="100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleAddDoctor} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Add Doctor
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Doctor"
        size="lg"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Dr. John Doe"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@hospital.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 234 567 8900"
            />
            <Select
              label="Department"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="e.g., Cardiology"
            />
            <Input
              label="Experience (years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              placeholder="e.g., MBBS, MD"
            />
            <Input
              label="Consultation Fee ($)"
              name="consultationFee"
              type="number"
              value={formData.consultationFee}
              onChange={handleInputChange}
              placeholder="100"
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleEditDoctor} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Doctor"
        size="sm"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {formError}
            </div>
          )}
          <p className="text-slate-600">
            Are you sure you want to delete <strong>{selectedDoctor?.name}</strong>? This action cannot be undone.
          </p>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteDoctor} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
