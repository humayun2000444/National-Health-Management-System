"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Table, Pagination, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  Calendar,
  FileText,
  Pill,
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  bloodGroup: string | null;
  address: string | null;
  emergencyContact: string | null;
  status: string;
  createdAt: string;
  _count: {
    appointments: number;
    prescriptions: number;
    medicalRecords: number;
  };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  address: "",
  emergencyContact: "",
};

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
  { value: "other", label: "Other" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError("Failed to load patients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.phone && patient.phone.includes(searchQuery));
    const matchesBloodGroup =
      !bloodGroupFilter || patient.bloodGroup === bloodGroupFilter;
    const matchesGender =
      !genderFilter ||
      patient.gender?.toLowerCase() === genderFilter.toLowerCase();
    return matchesSearch && matchesBloodGroup && matchesGender;
  });

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (isEdit = false): boolean => {
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setFormError("Email is required");
      return false;
    }
    if (!isEdit) {
      if (!formData.password) {
        setFormError("Password is required");
        return false;
      }
      if (formData.password.length < 6) {
        setFormError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setFormError("Passwords do not match");
        return false;
      }
    }
    setFormError("");
    return true;
  };

  const handleAddPatient = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          bloodGroup: formData.bloodGroup || null,
          address: formData.address || null,
          emergencyContact: formData.emergencyContact || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create patient");
      }

      setIsAddModalOpen(false);
      setFormData(initialFormData);
      fetchPatients();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to add patient");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPatient = async () => {
    if (!selectedPatient || !validateForm(true)) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/patients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedPatient.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          bloodGroup: formData.bloodGroup || null,
          address: formData.address || null,
          emergencyContact: formData.emergencyContact || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update patient");
      }

      setIsEditModalOpen(false);
      setSelectedPatient(null);
      setFormData(initialFormData);
      fetchPatients();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to update patient"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/patients?id=${selectedPatient.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete patient");
      }

      setIsDeleteModalOpen(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to delete patient"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone || "",
      password: "",
      confirmPassword: "",
      dateOfBirth: patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: patient.gender || "",
      bloodGroup: patient.bloodGroup || "",
      address: patient.address || "",
      emergencyContact: patient.emergencyContact || "",
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormError("");
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const calculateAge = (dateOfBirth: string | null): string => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return `${age} years`;
  };

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
      render: (patient) => patient.phone || "N/A",
    },
    {
      key: "gender",
      header: "Gender",
      render: (patient) =>
        patient.gender
          ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
          : "N/A",
    },
    {
      key: "age",
      header: "Age",
      render: (patient) => calculateAge(patient.dateOfBirth),
    },
    {
      key: "bloodGroup",
      header: "Blood Group",
      render: (patient) =>
        patient.bloodGroup ? (
          <Badge variant="primary">{patient.bloodGroup}</Badge>
        ) : (
          "N/A"
        ),
    },
    {
      key: "records",
      header: "Records",
      render: (patient) => (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {patient._count.appointments}
          </span>
          <span className="flex items-center gap-1">
            <Pill className="h-3 w-3" />
            {patient._count.prescriptions}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {patient._count.medicalRecords}
          </span>
        </div>
      ),
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
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openViewModal(patient)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(patient)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteModal(patient)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Patients" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header title="Patients" subtitle="Error loading data" />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={fetchPatients}
            className="flex items-center gap-2"
          >
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
        title="Patients"
        subtitle={`${patients.length} total patients`}
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-44">
              <Select
                options={bloodGroups}
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
              />
            </div>
            <div className="w-36">
              <Select
                options={genderOptions}
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => {
                setFormData(initialFormData);
                setFormError("");
                setIsAddModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Patients Table */}
        <Table
          columns={columns}
          data={paginatedPatients}
          keyExtractor={(patient) => patient.id}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPatients.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Patient"
        size="lg"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="john@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              name="phone"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Gender"
              name="gender"
              options={genderOptions.slice(1)}
              placeholder="Select gender"
              value={formData.gender}
              onChange={handleInputChange}
            />
            <Select
              label="Blood Group"
              name="bloodGroup"
              options={bloodGroups.slice(1)}
              placeholder="Select blood group"
              value={formData.bloodGroup}
              onChange={handleInputChange}
            />
          </div>
          <Input
            label="Address"
            name="address"
            placeholder="123 Main St, City, Country"
            value={formData.address}
            onChange={handleInputChange}
          />
          <Input
            label="Emergency Contact"
            name="emergencyContact"
            placeholder="Jane Doe - +1 234 567 8900"
            value={formData.emergencyContact}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
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
          <Button onClick={handleAddPatient} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Patient"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Patient"
        size="lg"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="john@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              name="phone"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Gender"
              name="gender"
              options={genderOptions.slice(1)}
              placeholder="Select gender"
              value={formData.gender}
              onChange={handleInputChange}
            />
            <Select
              label="Blood Group"
              name="bloodGroup"
              options={bloodGroups.slice(1)}
              placeholder="Select blood group"
              value={formData.bloodGroup}
              onChange={handleInputChange}
            />
          </div>
          <Input
            label="Address"
            name="address"
            placeholder="123 Main St, City, Country"
            value={formData.address}
            onChange={handleInputChange}
          />
          <Input
            label="Emergency Contact"
            name="emergencyContact"
            placeholder="Jane Doe - +1 234 567 8900"
            value={formData.emergencyContact}
            onChange={handleInputChange}
          />
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleEditPatient} disabled={submitting}>
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

      {/* View Patient Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Patient Details"
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar fallback={selectedPatient.name} size="lg" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {selectedPatient.name}
                </h3>
                <p className="text-slate-500">{selectedPatient.email}</p>
                <Badge
                  variant={
                    selectedPatient.status === "active" ? "success" : "secondary"
                  }
                  className="mt-1"
                >
                  {selectedPatient.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium">
                  {selectedPatient.phone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date of Birth</p>
                <p className="font-medium">
                  {selectedPatient.dateOfBirth
                    ? new Date(selectedPatient.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Gender</p>
                <p className="font-medium">
                  {selectedPatient.gender
                    ? selectedPatient.gender.charAt(0).toUpperCase() +
                      selectedPatient.gender.slice(1)
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Blood Group</p>
                <p className="font-medium">
                  {selectedPatient.bloodGroup || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Age</p>
                <p className="font-medium">
                  {calculateAge(selectedPatient.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Registered</p>
                <p className="font-medium">
                  {new Date(selectedPatient.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500">Address</p>
              <p className="font-medium">
                {selectedPatient.address || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Emergency Contact</p>
              <p className="font-medium">
                {selectedPatient.emergencyContact || "Not provided"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {selectedPatient._count.appointments}
                </p>
                <p className="text-sm text-slate-600">Appointments</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <Pill className="h-6 w-6 mx-auto text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-emerald-600">
                  {selectedPatient._count.prescriptions}
                </p>
                <p className="text-sm text-slate-600">Prescriptions</p>
              </div>
              <div className="text-center p-4 bg-violet-50 rounded-lg">
                <FileText className="h-6 w-6 mx-auto text-violet-600 mb-2" />
                <p className="text-2xl font-bold text-violet-600">
                  {selectedPatient._count.medicalRecords}
                </p>
                <p className="text-sm text-slate-600">Medical Records</p>
              </div>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              setIsViewModalOpen(false);
              if (selectedPatient) openEditModal(selectedPatient);
            }}
          >
            Edit Patient
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Patient"
        size="sm"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <p className="text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedPatient?.name}</span>? This
            action cannot be undone and will remove all associated records.
          </p>
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeletePatient}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Patient"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
