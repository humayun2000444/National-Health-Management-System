"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, Pagination, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import {
  Eye,
  Loader2,
  RefreshCw,
  AlertCircle,
  Heart,
  Thermometer,
  Activity,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface VitalSign {
  id: number;
  recordedBy: Doctor;
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

interface Averages {
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  heartRate: number | null;
  temperature: number | null;
  oxygenSaturation: number | null;
}

export default function PatientVitalsPage() {
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [latest, setLatest] = useState<VitalSign | null>(null);
  const [averages, setAverages] = useState<Averages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVital, setSelectedVital] = useState<VitalSign | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/patient/vitals");
      if (!response.ok) throw new Error("Failed to fetch vital signs");
      const data = await response.json();
      setVitals(data.vitals);
      setLatest(data.latest);
      setAverages(data.averages);
    } catch (err) {
      setError("Failed to load vital signs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const paginatedVitals = vitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(vitals.length / itemsPerPage);

  const openViewModal = (vital: VitalSign) => {
    setSelectedVital(vital);
    setIsViewModalOpen(true);
  };

  const getBPStatus = (systolic: number | null, diastolic: number | null) => {
    if (!systolic || !diastolic) return null;
    if (systolic >= 180 || diastolic >= 120) return { text: "Crisis", variant: "danger" as const };
    if (systolic >= 140 || diastolic >= 90) return { text: "High", variant: "warning" as const };
    if (systolic >= 130 || diastolic >= 80) return { text: "Elevated", variant: "warning" as const };
    if (systolic < 90 || diastolic < 60) return { text: "Low", variant: "primary" as const };
    return { text: "Normal", variant: "success" as const };
  };

  const getHRStatus = (hr: number | null) => {
    if (!hr) return null;
    if (hr > 100) return { text: "High", variant: "warning" as const };
    if (hr < 60) return { text: "Low", variant: "primary" as const };
    return { text: "Normal", variant: "success" as const };
  };

  const getO2Status = (o2: number | null) => {
    if (!o2) return null;
    if (o2 < 90) return { text: "Critical", variant: "danger" as const };
    if (o2 < 95) return { text: "Low", variant: "warning" as const };
    return { text: "Normal", variant: "success" as const };
  };

  const getTrend = (current: number | null, average: number | null) => {
    if (!current || !average) return null;
    const diff = current - average;
    const percentage = Math.abs(diff / average) * 100;
    if (percentage < 5) return { icon: Minus, color: "text-slate-400", text: "Stable" };
    if (diff > 0) return { icon: TrendingUp, color: "text-red-500", text: "Above avg" };
    return { icon: TrendingDown, color: "text-blue-500", text: "Below avg" };
  };

  const columns: Column<VitalSign>[] = [
    {
      key: "recordedAt",
      header: "Date",
      render: (vital) => (
        <div>
          <p className="font-medium">{new Date(vital.recordedAt).toLocaleDateString()}</p>
          <p className="text-sm text-slate-500">{new Date(vital.recordedAt).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      key: "bloodPressure",
      header: "Blood Pressure",
      render: (vital) => {
        const status = getBPStatus(vital.bloodPressureSystolic, vital.bloodPressureDiastolic);
        return vital.bloodPressureSystolic && vital.bloodPressureDiastolic ? (
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
            </span>
            {status && <Badge variant={status.variant}>{status.text}</Badge>}
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
          <div className="flex items-center gap-2">
            <span className="font-medium">{vital.heartRate} bpm</span>
            {status && <Badge variant={status.variant}>{status.text}</Badge>}
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
          <span className="font-medium">{vital.temperature}°C</span>
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
          <div className="flex items-center gap-2">
            <span className="font-medium">{vital.oxygenSaturation}%</span>
            {status && <Badge variant={status.variant}>{status.text}</Badge>}
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        );
      },
    },
    {
      key: "recordedBy",
      header: "Doctor",
      render: (vital) => (
        <div>
          <p className="text-sm">Dr. {vital.recordedBy.name}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (vital) => (
        <Button variant="ghost" size="sm" onClick={() => openViewModal(vital)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading && vitals.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="My Vital Signs" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="My Vital Signs"
        subtitle="Track your health measurements over time"
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

        {/* Latest Vitals Cards */}
        {latest && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Latest Readings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Blood Pressure</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {latest.bloodPressureSystolic && latest.bloodPressureDiastolic
                          ? `${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}`
                          : "-"}
                      </p>
                      <p className="text-sm text-slate-500">mmHg</p>
                    </div>
                    {latest.bloodPressureSystolic && (
                      (() => {
                        const status = getBPStatus(latest.bloodPressureSystolic, latest.bloodPressureDiastolic);
                        return status ? <Badge variant={status.variant}>{status.text}</Badge> : null;
                      })()
                    )}
                  </div>
                  {averages?.bloodPressureSystolic && (
                    <p className="text-xs text-slate-400 mt-2">
                      30-day avg: {averages.bloodPressureSystolic}/{averages.bloodPressureDiastolic}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Activity className="h-5 w-5 text-pink-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Heart Rate</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {latest.heartRate || "-"}
                      </p>
                      <p className="text-sm text-slate-500">bpm</p>
                    </div>
                    {latest.heartRate && (
                      (() => {
                        const status = getHRStatus(latest.heartRate);
                        return status ? <Badge variant={status.variant}>{status.text}</Badge> : null;
                      })()
                    )}
                  </div>
                  {averages?.heartRate && latest.heartRate && (
                    (() => {
                      const trend = getTrend(latest.heartRate, averages.heartRate);
                      return trend ? (
                        <div className="flex items-center gap-1 mt-2">
                          <trend.icon className={`h-3 w-3 ${trend.color}`} />
                          <span className="text-xs text-slate-400">{trend.text} (avg: {averages.heartRate})</span>
                        </div>
                      ) : null;
                    })()
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Thermometer className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Temperature</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {latest.temperature || "-"}
                      </p>
                      <p className="text-sm text-slate-500">°C</p>
                    </div>
                    {latest.temperature && (
                      <Badge variant={latest.temperature > 37.5 ? "warning" : latest.temperature < 36 ? "primary" : "success"}>
                        {latest.temperature > 37.5 ? "Fever" : latest.temperature < 36 ? "Low" : "Normal"}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Droplets className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Oxygen Saturation</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {latest.oxygenSaturation || "-"}
                      </p>
                      <p className="text-sm text-slate-500">%</p>
                    </div>
                    {latest.oxygenSaturation && (
                      (() => {
                        const status = getO2Status(latest.oxygenSaturation);
                        return status ? <Badge variant={status.variant}>{status.text}</Badge> : null;
                      })()
                    )}
                  </div>
                  {averages?.oxygenSaturation && (
                    <p className="text-xs text-slate-400 mt-2">
                      30-day avg: {averages.oxygenSaturation}%
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Health Tips */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Understanding Your Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900 mb-1">Blood Pressure</p>
                <p className="text-slate-600">Normal: &lt;120/80 mmHg</p>
                <p className="text-slate-500 text-xs mt-1">Measure at rest for accuracy</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900 mb-1">Heart Rate</p>
                <p className="text-slate-600">Normal: 60-100 bpm</p>
                <p className="text-slate-500 text-xs mt-1">Athletes may have lower rates</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900 mb-1">Temperature</p>
                <p className="text-slate-600">Normal: 36.1-37.2°C</p>
                <p className="text-slate-500 text-xs mt-1">Varies throughout the day</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900 mb-1">Oxygen Saturation</p>
                <p className="text-slate-600">Normal: 95-100%</p>
                <p className="text-slate-500 text-xs mt-1">Below 90% needs attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vitals History */}
        <Card>
          <CardHeader>
            <CardTitle>Vitals History</CardTitle>
          </CardHeader>
          <CardContent>
            {vitals.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Vital Signs Recorded</h3>
                <p className="text-slate-500">
                  Your vital signs will appear here after your doctor records them.
                </p>
              </div>
            ) : (
              <>
                <Table
                  columns={columns}
                  data={paginatedVitals}
                  keyExtractor={(vital) => vital.id.toString()}
                />

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={vitals.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

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
                <p className="text-sm text-slate-500">Recorded by</p>
                <p className="font-medium">Dr. {selectedVital.recordedBy.name}</p>
                <p className="text-sm text-slate-500">{selectedVital.recordedBy.specialization}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Date & Time</p>
                <p className="font-medium">{new Date(selectedVital.recordedAt).toLocaleString()}</p>
              </div>
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

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Weight</p>
                <p className="font-medium">{selectedVital.weight ? `${selectedVital.weight} kg` : "-"}</p>
              </div>
              <div>
                <p className="text-slate-500">Height</p>
                <p className="font-medium">{selectedVital.height ? `${selectedVital.height} cm` : "-"}</p>
              </div>
              <div>
                <p className="text-slate-500">Pain Level</p>
                <p className="font-medium">
                  {selectedVital.painLevel !== null ? `${selectedVital.painLevel}/10` : "-"}
                </p>
              </div>
            </div>

            {selectedVital.notes && (
              <div>
                <h4 className="font-medium mb-2">Doctor&apos;s Notes</h4>
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
        </ModalFooter>
      </Modal>
    </div>
  );
}
