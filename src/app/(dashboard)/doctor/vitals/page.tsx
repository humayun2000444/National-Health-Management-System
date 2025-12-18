"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, Pagination, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
  Heart,
  Thermometer,
  Activity,
  Droplets,
  Users,
} from "lucide-react";

interface Patient {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string | null;
  gender: string | null;
}

interface VitalSign {
  id: number;
  patientId: number;
  patient: Patient;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  heartRate: number | null;
  temperature: number | null;
  respiratoryRate: number | null;
  oxygenSaturation: number | null;
  weight: number | null;
  height: number | null;
  bloodGlucose: number | null;
  painLevel: number | null;
  notes: string | null;
  recordedAt: string;
}

interface DoctorPatient {
  id: number;
  name: string;
  email: string;
}

interface VitalFormData {
  patientId: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  weight: string;
  height: string;
  bloodGlucose: string;
  painLevel: string;
  notes: string;
}

const initialFormData: VitalFormData = {
  patientId: "",
  bloodPressureSystolic: "",
  bloodPressureDiastolic: "",
  heartRate: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  weight: "",
  height: "",
  bloodGlucose: "",
  painLevel: "",
  notes: "",
};

const painLevelOptions = [
  { value: "", label: "Not assessed" },
  { value: "0", label: "0 - No pain" },
  { value: "1", label: "1 - Minimal" },
  { value: "2", label: "2 - Mild" },
  { value: "3", label: "3 - Uncomfortable" },
  { value: "4", label: "4 - Moderate" },
  { value: "5", label: "5 - Distracting" },
  { value: "6", label: "6 - Distressing" },
  { value: "7", label: "7 - Unmanageable" },
  { value: "8", label: "8 - Intense" },
  { value: "9", label: "9 - Severe" },
  { value: "10", label: "10 - Unable to move" },
];

export default function VitalsPage() {
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [stats, setStats] = useState({ totalRecords: 0, uniquePatients: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVital, setSelectedVital] = useState<VitalSign | null>(null);
  const [formData, setFormData] = useState<VitalFormData>(initialFormData);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVitals();
    fetchPatients();
  }, []);

  const fetchVitals = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/doctor/vitals");
      if (!response.ok) throw new Error("Failed to fetch vital signs");
      const data = await response.json();
      setVitals(data.vitals);
      setStats(data.stats);
    } catch (err) {
      setError("Failed to load vital signs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/doctor/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data.patients || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredVitals = vitals.filter((vital) => {
    const matchesSearch = vital.patient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedVitals = filteredVitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVitals.length / itemsPerPage);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVital = async () => {
    if (!formData.patientId) {
      setFormError("Please select a patient");
      return;
    }

    // Check if at least one vital is entered
    const hasVital =
      formData.bloodPressureSystolic ||
      formData.heartRate ||
      formData.temperature ||
      formData.oxygenSaturation ||
      formData.weight ||
      formData.bloodGlucose;

    if (!hasVital) {
      setFormError("Please enter at least one vital sign measurement");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/doctor/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: formData.patientId,
          bloodPressureSystolic: formData.bloodPressureSystolic || null,
          bloodPressureDiastolic: formData.bloodPressureDiastolic || null,
          heartRate: formData.heartRate || null,
          temperature: formData.temperature || null,
          respiratoryRate: formData.respiratoryRate || null,
          oxygenSaturation: formData.oxygenSaturation || null,
          weight: formData.weight || null,
          height: formData.height || null,
          bloodGlucose: formData.bloodGlucose || null,
          painLevel: formData.painLevel || null,
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to record vital signs");
      }

      setIsAddModalOpen(false);
      setFormData(initialFormData);
      fetchVitals();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to record vital signs");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditVital = async () => {
    if (!selectedVital) return;

    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/doctor/vitals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedVital.id,
          bloodPressureSystolic: formData.bloodPressureSystolic || null,
          bloodPressureDiastolic: formData.bloodPressureDiastolic || null,
          heartRate: formData.heartRate || null,
          temperature: formData.temperature || null,
          respiratoryRate: formData.respiratoryRate || null,
          oxygenSaturation: formData.oxygenSaturation || null,
          weight: formData.weight || null,
          height: formData.height || null,
          bloodGlucose: formData.bloodGlucose || null,
          painLevel: formData.painLevel || null,
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update vital signs");
      }

      setIsEditModalOpen(false);
      setSelectedVital(null);
      setFormData(initialFormData);
      fetchVitals();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to update vital signs");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVital = async () => {
    if (!selectedVital) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/doctor/vitals?id=${selectedVital.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete record");
      }

      setIsDeleteModalOpen(false);
      setSelectedVital(null);
      fetchVitals();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to delete record");
    } finally {
      setSubmitting(false);
    }
  };

  const openViewModal = (vital: VitalSign) => {
    setSelectedVital(vital);
    setIsViewModalOpen(true);
  };

  const openEditModal = (vital: VitalSign) => {
    setSelectedVital(vital);
    setFormData({
      patientId: vital.patientId.toString(),
      bloodPressureSystolic: vital.bloodPressureSystolic?.toString() || "",
      bloodPressureDiastolic: vital.bloodPressureDiastolic?.toString() || "",
      heartRate: vital.heartRate?.toString() || "",
      temperature: vital.temperature?.toString() || "",
      respiratoryRate: vital.respiratoryRate?.toString() || "",
      oxygenSaturation: vital.oxygenSaturation?.toString() || "",
      weight: vital.weight?.toString() || "",
      height: vital.height?.toString() || "",
      bloodGlucose: vital.bloodGlucose?.toString() || "",
      painLevel: vital.painLevel?.toString() || "",
      notes: vital.notes || "",
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (vital: VitalSign) => {
    setSelectedVital(vital);
    setFormError("");
    setIsDeleteModalOpen(true);
  };

  const getBPStatus = (systolic: number | null, diastolic: number | null) => {
    if (!systolic || !diastolic) return null;
    if (systolic >= 180 || diastolic >= 120) return { text: "Crisis", color: "text-red-600 bg-red-100" };
    if (systolic >= 140 || diastolic >= 90) return { text: "High", color: "text-orange-600 bg-orange-100" };
    if (systolic >= 130 || diastolic >= 80) return { text: "Elevated", color: "text-amber-600 bg-amber-100" };
    if (systolic < 90 || diastolic < 60) return { text: "Low", color: "text-blue-600 bg-blue-100" };
    return { text: "Normal", color: "text-green-600 bg-green-100" };
  };

  const getHRStatus = (hr: number | null) => {
    if (!hr) return null;
    if (hr > 100) return { text: "Tachycardia", color: "text-red-600 bg-red-100" };
    if (hr < 60) return { text: "Bradycardia", color: "text-blue-600 bg-blue-100" };
    return { text: "Normal", color: "text-green-600 bg-green-100" };
  };

  const getO2Status = (o2: number | null) => {
    if (!o2) return null;
    if (o2 < 90) return { text: "Critical", color: "text-red-600 bg-red-100" };
    if (o2 < 95) return { text: "Low", color: "text-amber-600 bg-amber-100" };
    return { text: "Normal", color: "text-green-600 bg-green-100" };
  };

  const columns: Column<VitalSign>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (vital) => (
        <div>
          <p className="font-medium text-slate-900">{vital.patient.name}</p>
          <p className="text-sm text-slate-500">{vital.patient.email}</p>
        </div>
      ),
    },
    {
      key: "bloodPressure",
      header: "Blood Pressure",
      render: (vital) => {
        const status = getBPStatus(vital.bloodPressureSystolic, vital.bloodPressureDiastolic);
        return vital.bloodPressureSystolic && vital.bloodPressureDiastolic ? (
          <div>
            <span className="font-medium">
              {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
            </span>
            <span className="text-slate-500 ml-1">mmHg</span>
            {status && (
              <Badge className={`ml-2 ${status.color}`}>{status.text}</Badge>
            )}
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        );
      },
    },
    {
      key: "heartRate",
      header: "Heart Rate",
      render: (vital) => {
        const status = getHRStatus(vital.heartRate);
        return vital.heartRate ? (
          <div>
            <span className="font-medium">{vital.heartRate}</span>
            <span className="text-slate-500 ml-1">bpm</span>
            {status && (
              <Badge className={`ml-2 ${status.color}`}>{status.text}</Badge>
            )}
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        );
      },
    },
    {
      key: "temperature",
      header: "Temp",
      render: (vital) =>
        vital.temperature ? (
          <span>
            <span className="font-medium">{vital.temperature}</span>
            <span className="text-slate-500">°C</span>
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      key: "oxygenSaturation",
      header: "SpO2",
      render: (vital) => {
        const status = getO2Status(vital.oxygenSaturation);
        return vital.oxygenSaturation ? (
          <div>
            <span className="font-medium">{vital.oxygenSaturation}</span>
            <span className="text-slate-500">%</span>
            {status && (
              <Badge className={`ml-2 ${status.color}`}>{status.text}</Badge>
            )}
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        );
      },
    },
    {
      key: "recordedAt",
      header: "Recorded",
      render: (vital) => new Date(vital.recordedAt).toLocaleString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (vital) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openViewModal(vital)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEditModal(vital)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteModal(vital)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading && vitals.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Vital Signs" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Vital Signs"
        subtitle="Record and monitor patient vital signs"
      />

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
            <Button variant="ghost" size="sm" onClick={fetchVitals} className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Records</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalRecords}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Patients Monitored</p>
                  <p className="text-2xl font-bold text-green-600">{stats.uniquePatients}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Today&apos;s Records</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {vitals.filter((v) => {
                      const today = new Date().toDateString();
                      return new Date(v.recordedAt).toDateString() === today;
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Heart className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">This Week</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {vitals.filter((v) => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(v.recordedAt) >= weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-slate-100 rounded-full">
                  <Thermometer className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by patient name..."
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
            Record Vitals
          </Button>
        </div>

        {/* Vitals Table */}
        <Table
          columns={columns}
          data={paginatedVitals}
          keyExtractor={(vital) => vital.id.toString()}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredVitals.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Add/Edit Modal Form Fields - shared component */}
      {(isAddModalOpen || isEditModalOpen) && (
        <Modal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }}
          title={isAddModalOpen ? "Record Vital Signs" : "Edit Vital Signs"}
          size="lg"
        >
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}

            {isAddModalOpen && (
              <Select
                label="Patient"
                name="patientId"
                options={[
                  { value: "", label: "Select a patient" },
                  ...patients.map((p) => ({
                    value: p.id.toString(),
                    label: `${p.name} (${p.email})`,
                  })),
                ]}
                value={formData.patientId}
                onChange={handleInputChange}
                required
              />
            )}

            {isEditModalOpen && selectedVital && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Patient</p>
                <p className="font-semibold">{selectedVital.patient.name}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Systolic BP (mmHg)"
                name="bloodPressureSystolic"
                type="number"
                value={formData.bloodPressureSystolic}
                onChange={handleInputChange}
                placeholder="120"
                min={60}
                max={250}
              />
              <Input
                label="Diastolic BP (mmHg)"
                name="bloodPressureDiastolic"
                type="number"
                value={formData.bloodPressureDiastolic}
                onChange={handleInputChange}
                placeholder="80"
                min={40}
                max={150}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Heart Rate (bpm)"
                name="heartRate"
                type="number"
                value={formData.heartRate}
                onChange={handleInputChange}
                placeholder="72"
                min={30}
                max={220}
              />
              <Input
                label="Temperature (°C)"
                name="temperature"
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={handleInputChange}
                placeholder="36.6"
                min={34}
                max={42}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Respiratory Rate (/min)"
                name="respiratoryRate"
                type="number"
                value={formData.respiratoryRate}
                onChange={handleInputChange}
                placeholder="16"
                min={8}
                max={40}
              />
              <Input
                label="Oxygen Saturation (%)"
                name="oxygenSaturation"
                type="number"
                value={formData.oxygenSaturation}
                onChange={handleInputChange}
                placeholder="98"
                min={70}
                max={100}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Weight (kg)"
                name="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="70"
              />
              <Input
                label="Height (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="170"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Blood Glucose (mg/dL)"
                name="bloodGlucose"
                type="number"
                value={formData.bloodGlucose}
                onChange={handleInputChange}
                placeholder="100"
              />
              <Select
                label="Pain Level (0-10)"
                name="painLevel"
                options={painLevelOptions}
                value={formData.painLevel}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional observations..."
              />
            </div>
          </div>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={isAddModalOpen ? handleAddVital : handleEditVital}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isAddModalOpen ? (
                "Record Vitals"
              ) : (
                "Save Changes"
              )}
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Vital Signs Details"
        size="lg"
      >
        {selectedVital && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{selectedVital.patient.name}</h3>
                <p className="text-slate-500">{selectedVital.patient.email}</p>
              </div>
              <p className="text-sm text-slate-500">
                {new Date(selectedVital.recordedAt).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Blood Pressure</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {selectedVital.bloodPressureSystolic && selectedVital.bloodPressureDiastolic
                    ? `${selectedVital.bloodPressureSystolic}/${selectedVital.bloodPressureDiastolic}`
                    : "-"}
                </p>
                <p className="text-sm text-red-500">mmHg</p>
              </div>

              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-pink-600" />
                  <span className="text-sm font-medium text-pink-700">Heart Rate</span>
                </div>
                <p className="text-2xl font-bold text-pink-600">
                  {selectedVital.heartRate || "-"}
                </p>
                <p className="text-sm text-pink-500">bpm</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Temperature</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {selectedVital.temperature || "-"}
                </p>
                <p className="text-sm text-orange-500">°C</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">SpO2</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedVital.oxygenSaturation || "-"}
                </p>
                <p className="text-sm text-blue-500">%</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-700">Respiratory Rate</span>
                <p className="text-2xl font-bold text-green-600">
                  {selectedVital.respiratoryRate || "-"}
                </p>
                <p className="text-sm text-green-500">/min</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-700">Blood Glucose</span>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedVital.bloodGlucose || "-"}
                </p>
                <p className="text-sm text-purple-500">mg/dL</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500">Weight</p>
                <p className="font-medium">{selectedVital.weight ? `${selectedVital.weight} kg` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Height</p>
                <p className="font-medium">{selectedVital.height ? `${selectedVital.height} cm` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Pain Level</p>
                <p className="font-medium">{selectedVital.painLevel !== null ? `${selectedVital.painLevel}/10` : "-"}</p>
              </div>
            </div>

            {selectedVital.notes && (
              <div>
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  {selectedVital.notes}
                </p>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
          <Button onClick={() => {
            setIsViewModalOpen(false);
            if (selectedVital) openEditModal(selectedVital);
          }}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Vital Signs Record"
        size="sm"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <p className="text-slate-600">
            Are you sure you want to delete this vital signs record for{" "}
            <span className="font-semibold">{selectedVital?.patient.name}</span>?
            This action cannot be undone.
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
            onClick={handleDeleteVital}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Record"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
