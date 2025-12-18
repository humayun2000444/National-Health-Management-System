"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import {
  Search,
  Eye,
  FileText,
  Phone,
  Mail,
  Calendar,
  Activity,
  Loader2,
  Users,
  AlertCircle,
  Droplet,
  MapPin,
} from "lucide-react";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  age: number | null;
  gender: string | null;
  bloodGroup: string | null;
  address: string | null;
  allergies: string | null;
  chronicConditions: string | null;
  condition: string;
  lastVisit: string;
  nextAppointment: string | null;
  totalVisits: number;
  status: string;
}

interface Stats {
  total: number;
  ongoing: number;
  stable: number;
}

export default function DoctorPatientsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, ongoing: 0, stable: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/doctor/patients?${params}`);
      if (!response.ok) throw new Error("Failed to fetch patients");

      const data = await response.json();
      setPatients(data.patients);
      setStats(data.stats);
    } catch (err) {
      setError("Failed to load patients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPatients();
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && patients.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="My Patients" subtitle="View and manage your patients" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="My Patients" subtitle="View and manage your patients" />

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Total Patients</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Ongoing Treatment</p>
              <p className="text-2xl font-bold text-blue-600">{stats.ongoing}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Stable</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.stable}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search patients or conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Patients Grid */}
        {filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={patient.avatar || undefined}
                        fallback={patient.name}
                        size="lg"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {patient.age ? `${patient.age} yrs` : "Age N/A"}
                          {patient.gender && `, ${patient.gender}`}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        patient.status === "Ongoing"
                          ? "primary"
                          : patient.status === "Stable"
                          ? "success"
                          : "info"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 truncate">
                        {patient.condition}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        Last visit:{" "}
                        {new Date(patient.lastVisit).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {patient.bloodGroup && (
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          Blood: {patient.bloodGroup}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {patient.totalVisits} total visit{patient.totalVisits !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Link href="/doctor/records" className="flex-1">
                      <Button size="sm" className="w-full">
                        <FileText className="h-4 w-4 mr-1" />
                        Records
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No patients found.</p>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title="Patient Details"
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar
                src={selectedPatient.avatar || undefined}
                fallback={selectedPatient.name}
                size="xl"
              />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {selectedPatient.name}
                </h3>
                <p className="text-slate-500">
                  {selectedPatient.age ? `${selectedPatient.age} years old` : "Age N/A"}
                  {selectedPatient.gender && `, ${selectedPatient.gender}`}
                </p>
                <Badge
                  variant={
                    selectedPatient.status === "Ongoing"
                      ? "primary"
                      : selectedPatient.status === "Stable"
                      ? "success"
                      : "info"
                  }
                  className="mt-1"
                >
                  {selectedPatient.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Blood Group</p>
                <p className="font-semibold text-slate-900">
                  {selectedPatient.bloodGroup || "N/A"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Primary Condition</p>
                <p className="font-semibold text-slate-900">
                  {selectedPatient.condition}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Total Visits</p>
                <p className="font-semibold text-slate-900">
                  {selectedPatient.totalVisits}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Last Visit</p>
                <p className="font-semibold text-slate-900">
                  {new Date(selectedPatient.lastVisit).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedPatient.email && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="h-4 w-4" />
                  {selectedPatient.email}
                </div>
              )}
              {selectedPatient.phone && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="h-4 w-4" />
                  {selectedPatient.phone}
                </div>
              )}
              {selectedPatient.address && (
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  {selectedPatient.address}
                </div>
              )}
              {selectedPatient.nextAppointment && (
                <div className="flex items-center gap-3 text-blue-600">
                  <Calendar className="h-4 w-4" />
                  Next appointment:{" "}
                  {new Date(selectedPatient.nextAppointment).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </div>
              )}
            </div>

            {selectedPatient.allergies && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm font-medium text-red-800">Allergies</p>
                <p className="text-red-700">{selectedPatient.allergies}</p>
              </div>
            )}

            {selectedPatient.chronicConditions && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm font-medium text-amber-800">Chronic Conditions</p>
                <p className="text-amber-700">{selectedPatient.chronicConditions}</p>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setSelectedPatient(null)}>
            Close
          </Button>
          <Link href="/doctor/prescriptions">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Write Prescription
            </Button>
          </Link>
        </ModalFooter>
      </Modal>
    </div>
  );
}
