"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import {
  Loader2,
  AlertCircle,
  Plus,
  Clock,
  User,
  Phone,
  Activity,
  Heart,
  Thermometer,
  Wind,
  RefreshCw,
  UserPlus,
  Stethoscope,
  CheckCircle,
  XCircle,
  ArrowUp,
} from "lucide-react";

interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

interface EmergencyCase {
  id: number;
  patient: {
    id: number;
    name: string;
    phone: string | null;
    bloodGroup: string | null;
    age: number | null;
    gender: string | null;
    allergies: string | null;
  } | null;
  patientName: string | null;
  patientAge: number | null;
  patientGender: string | null;
  contactPhone: string | null;
  triageLevel: string;
  chiefComplaint: string;
  vitalSigns: VitalSigns | null;
  status: string;
  assignedDoctorId: number | null;
  arrivalTime: string;
  treatmentStartTime: string | null;
  dischargeTime: string | null;
  disposition: string | null;
  notes: string | null;
  waitTime: number | null;
}

interface Stats {
  total: number;
  byStatus: Record<string, number>;
  byTriage: Record<string, number>;
}

const triageLevels = [
  { value: "1-immediate", label: "1 - Immediate (Red)", color: "bg-red-600", textColor: "text-red-600" },
  { value: "2-emergent", label: "2 - Emergent (Orange)", color: "bg-orange-500", textColor: "text-orange-500" },
  { value: "3-urgent", label: "3 - Urgent (Yellow)", color: "bg-yellow-500", textColor: "text-yellow-600" },
  { value: "4-less_urgent", label: "4 - Less Urgent (Green)", color: "bg-green-500", textColor: "text-green-600" },
  { value: "5-non_urgent", label: "5 - Non-Urgent (Blue)", color: "bg-blue-500", textColor: "text-blue-600" },
];

const statusOptions = [
  { value: "waiting", label: "Waiting" },
  { value: "in_treatment", label: "In Treatment" },
  { value: "admitted", label: "Admitted" },
  { value: "discharged", label: "Discharged" },
  { value: "transferred", label: "Transferred" },
];

export default function EmergencyTriagePage() {
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, byStatus: {}, byTriage: {} });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTriage, setFilterTriage] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [saving, setSaving] = useState(false);

  // New case form
  const [newCase, setNewCase] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "",
    contactPhone: "",
    triageLevel: "3-urgent",
    chiefComplaint: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    notes: "",
  });

  // Update form
  const [updateForm, setUpdateForm] = useState({
    status: "",
    notes: "",
    triageLevel: "",
  });

  useEffect(() => {
    fetchCases();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCases, 30000);
    return () => clearInterval(interval);
  }, [filterStatus, filterTriage]);

  const fetchCases = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterTriage !== "all") params.append("triageLevel", filterTriage);

      const response = await fetch(`/api/admin/emergency?${params}`);
      if (!response.ok) throw new Error("Failed to fetch cases");

      const data = await response.json();
      setCases(data.cases);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
      setError("Failed to load emergency cases");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async () => {
    if (!newCase.chiefComplaint || !newCase.triageLevel) {
      setError("Chief complaint and triage level are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const vitalSigns: VitalSigns = {};
      if (newCase.bloodPressure) vitalSigns.bloodPressure = newCase.bloodPressure;
      if (newCase.heartRate) vitalSigns.heartRate = parseInt(newCase.heartRate);
      if (newCase.temperature) vitalSigns.temperature = parseFloat(newCase.temperature);
      if (newCase.respiratoryRate) vitalSigns.respiratoryRate = parseInt(newCase.respiratoryRate);
      if (newCase.oxygenSaturation) vitalSigns.oxygenSaturation = parseInt(newCase.oxygenSaturation);

      const response = await fetch("/api/admin/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCase,
          patientAge: newCase.patientAge || null,
          vitalSigns: Object.keys(vitalSigns).length > 0 ? vitalSigns : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create case");
      }

      setSuccess("Emergency case created successfully");
      setIsAddModalOpen(false);
      setNewCase({
        patientName: "",
        patientAge: "",
        patientGender: "",
        contactPhone: "",
        triageLevel: "3-urgent",
        chiefComplaint: "",
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        notes: "",
      });
      fetchCases();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create case");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCase = async () => {
    if (!selectedCase) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/emergency", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCase.id,
          ...updateForm,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update case");
      }

      setSuccess("Case updated successfully");
      setIsUpdateModalOpen(false);
      setSelectedCase(null);
      fetchCases();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update case");
    } finally {
      setSaving(false);
    }
  };

  const openUpdateModal = (c: EmergencyCase) => {
    setSelectedCase(c);
    setUpdateForm({
      status: c.status,
      notes: c.notes || "",
      triageLevel: c.triageLevel,
    });
    setIsUpdateModalOpen(true);
  };

  const getTriageInfo = (level: string) => {
    return triageLevels.find((t) => t.value === level) || triageLevels[2];
  };

  const formatWaitTime = (minutes: number | null) => {
    if (minutes === null) return "-";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Emergency Triage" subtitle="Manage emergency cases" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      </div>
    );
  }

  const activeCases = cases.filter((c) => c.status === "waiting" || c.status === "in_treatment");

  return (
    <div className="min-h-screen">
      <Header title="Emergency Triage" subtitle="Manage emergency cases and queue" />

      <div className="p-6">
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
            <button onClick={() => setError("")} className="ml-auto">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}

        {/* Triage Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {triageLevels.map((triage) => (
            <Card key={triage.value} className="overflow-hidden">
              <div className={`h-2 ${triage.color}`} />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      {triage.label.split(" - ")[1].split(" ")[0]}
                    </p>
                    <p className={`text-2xl font-bold ${triage.textColor}`}>
                      {stats.byTriage[triage.value] || 0}
                    </p>
                  </div>
                  <ArrowUp className={`h-5 w-5 ${triage.textColor}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Waiting</p>
                  <p className="text-xl font-bold">{stats.byStatus.waiting || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">In Treatment</p>
                  <p className="text-xl font-bold">{stats.byStatus.in_treatment || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Discharged Today</p>
                  <p className="text-xl font-bold">{stats.byStatus.discharged || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Cases</p>
                  <p className="text-xl font-bold">{activeCases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            New Emergency Case
          </Button>
          <Button variant="outline" onClick={fetchCases}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="flex-1" />
          <Select
            options={[
              { value: "all", label: "All Statuses" },
              ...statusOptions,
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-40"
          />
          <Select
            options={[
              { value: "all", label: "All Triage Levels" },
              ...triageLevels.map((t) => ({ value: t.value, label: t.label })),
            ]}
            value={filterTriage}
            onChange={(e) => setFilterTriage(e.target.value)}
            className="w-48"
          />
        </div>

        {/* Emergency Queue */}
        <div className="space-y-4">
          {cases.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No emergency cases found</p>
              </CardContent>
            </Card>
          ) : (
            cases.map((c) => {
              const triage = getTriageInfo(c.triageLevel);
              return (
                <Card
                  key={c.id}
                  className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                    c.status === "waiting" ? "border-l-4" : ""
                  }`}
                  style={{
                    borderLeftColor: c.status === "waiting" ? triage.color.replace("bg-", "") : undefined,
                  }}
                  onClick={() => openUpdateModal(c)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Triage Badge */}
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl ${triage.color}`}
                      >
                        {c.triageLevel.split("-")[0]}
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">
                            {c.patientName || c.patient?.name || "Unknown Patient"}
                          </h3>
                          <Badge
                            variant={
                              c.status === "waiting"
                                ? "warning"
                                : c.status === "in_treatment"
                                ? "primary"
                                : "success"
                            }
                          >
                            {c.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <p className="text-slate-600 line-clamp-2 mb-2">{c.chiefComplaint}</p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                          {(c.patientAge || c.patient?.age) && (
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {c.patientAge || c.patient?.age} yrs,{" "}
                              {c.patientGender || c.patient?.gender || "N/A"}
                            </span>
                          )}
                          {(c.contactPhone || c.patient?.phone) && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              {c.contactPhone || c.patient?.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Arrived: {new Date(c.arrivalTime).toLocaleTimeString()}
                          </span>
                          {c.waitTime !== null && c.status === "waiting" && (
                            <span className={`font-medium ${c.waitTime > 60 ? "text-red-600" : ""}`}>
                              Wait: {formatWaitTime(c.waitTime)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Vital Signs */}
                      {c.vitalSigns && (
                        <div className="hidden md:flex items-center gap-4 text-sm">
                          {c.vitalSigns.bloodPressure && (
                            <div className="text-center">
                              <Heart className="h-4 w-4 mx-auto text-red-500" />
                              <p className="text-xs text-slate-500">BP</p>
                              <p className="font-medium">{c.vitalSigns.bloodPressure}</p>
                            </div>
                          )}
                          {c.vitalSigns.heartRate && (
                            <div className="text-center">
                              <Activity className="h-4 w-4 mx-auto text-pink-500" />
                              <p className="text-xs text-slate-500">HR</p>
                              <p className="font-medium">{c.vitalSigns.heartRate}</p>
                            </div>
                          )}
                          {c.vitalSigns.temperature && (
                            <div className="text-center">
                              <Thermometer className="h-4 w-4 mx-auto text-orange-500" />
                              <p className="text-xs text-slate-500">Temp</p>
                              <p className="font-medium">{c.vitalSigns.temperature}°C</p>
                            </div>
                          )}
                          {c.vitalSigns.oxygenSaturation && (
                            <div className="text-center">
                              <Wind className="h-4 w-4 mx-auto text-blue-500" />
                              <p className="text-xs text-slate-500">SpO2</p>
                              <p className="font-medium">{c.vitalSigns.oxygenSaturation}%</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* New Case Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Emergency Case"
        size="xl"
      >
        <div className="space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Patient Name"
              placeholder="Enter patient name"
              value={newCase.patientName}
              onChange={(e) => setNewCase({ ...newCase, patientName: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Age"
                type="number"
                placeholder="Age"
                value={newCase.patientAge}
                onChange={(e) => setNewCase({ ...newCase, patientAge: e.target.value })}
              />
              <Select
                label="Gender"
                options={[
                  { value: "", label: "Select" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                value={newCase.patientGender}
                onChange={(e) => setNewCase({ ...newCase, patientGender: e.target.value })}
              />
            </div>
          </div>

          <Input
            label="Contact Phone"
            placeholder="Emergency contact number"
            value={newCase.contactPhone}
            onChange={(e) => setNewCase({ ...newCase, contactPhone: e.target.value })}
          />

          {/* Triage Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Triage Level *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {triageLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setNewCase({ ...newCase, triageLevel: level.value })}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    newCase.triageLevel === level.value
                      ? `${level.color} text-white border-transparent`
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-lg font-bold">{level.value.split("-")[0]}</div>
                  <div className="text-xs">{level.label.split(" - ")[1].split(" ")[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Chief Complaint *
            </label>
            <textarea
              rows={3}
              value={newCase.chiefComplaint}
              onChange={(e) => setNewCase({ ...newCase, chiefComplaint: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Describe the patient's main symptoms and reason for emergency visit..."
            />
          </div>

          {/* Vital Signs */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Initial Vital Signs</label>
            <div className="grid grid-cols-5 gap-3">
              <Input
                placeholder="BP (e.g., 120/80)"
                value={newCase.bloodPressure}
                onChange={(e) => setNewCase({ ...newCase, bloodPressure: e.target.value })}
              />
              <Input
                placeholder="Heart Rate"
                type="number"
                value={newCase.heartRate}
                onChange={(e) => setNewCase({ ...newCase, heartRate: e.target.value })}
              />
              <Input
                placeholder="Temp (°C)"
                type="number"
                step="0.1"
                value={newCase.temperature}
                onChange={(e) => setNewCase({ ...newCase, temperature: e.target.value })}
              />
              <Input
                placeholder="Resp Rate"
                type="number"
                value={newCase.respiratoryRate}
                onChange={(e) => setNewCase({ ...newCase, respiratoryRate: e.target.value })}
              />
              <Input
                placeholder="SpO2 %"
                type="number"
                value={newCase.oxygenSaturation}
                onChange={(e) => setNewCase({ ...newCase, oxygenSaturation: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Notes</label>
            <textarea
              rows={2}
              value={newCase.notes}
              onChange={(e) => setNewCase({ ...newCase, notes: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information (allergies, medications, etc.)..."
            />
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateCase}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700"
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
            Register Emergency
          </Button>
        </ModalFooter>
      </Modal>

      {/* Update Case Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedCase(null);
        }}
        title="Update Emergency Case"
        size="lg"
      >
        {selectedCase && (
          <div className="space-y-6">
            {/* Patient Summary */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                    getTriageInfo(selectedCase.triageLevel).color
                  }`}
                >
                  {selectedCase.triageLevel.split("-")[0]}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {selectedCase.patientName || selectedCase.patient?.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Arrived: {new Date(selectedCase.arrivalTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-700">{selectedCase.chiefComplaint}</p>
            </div>

            {/* Update Status */}
            <Select
              label="Status"
              options={statusOptions}
              value={updateForm.status}
              onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
            />

            {/* Update Triage */}
            <Select
              label="Triage Level"
              options={triageLevels.map((t) => ({ value: t.value, label: t.label }))}
              value={updateForm.triageLevel}
              onChange={(e) => setUpdateForm({ ...updateForm, triageLevel: e.target.value })}
            />

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
              <textarea
                rows={4}
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add treatment notes, observations, or updates..."
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUpdateForm({ ...updateForm, status: "in_treatment" })}
                className="flex-1"
              >
                <Stethoscope className="h-4 w-4 mr-1" />
                Start Treatment
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUpdateForm({ ...updateForm, status: "discharged" })}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Discharge
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUpdateForm({ ...updateForm, status: "admitted" })}
                className="flex-1"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Admit
              </Button>
            </div>
          </div>
        )}

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsUpdateModalOpen(false);
              setSelectedCase(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateCase} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Update Case
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
