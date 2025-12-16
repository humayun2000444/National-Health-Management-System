"use client";

import { useState } from "react";
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
} from "lucide-react";

const patientsData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 234 567 8901",
    age: 45,
    gender: "Male",
    bloodGroup: "A+",
    condition: "Hypertension",
    lastVisit: "2024-01-20",
    nextAppointment: "2024-02-05",
    status: "Ongoing",
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 234 567 8902",
    age: 32,
    gender: "Female",
    bloodGroup: "B+",
    condition: "Diabetes Type 2",
    lastVisit: "2024-01-19",
    nextAppointment: "2024-01-25",
    status: "Ongoing",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.j@email.com",
    phone: "+1 234 567 8903",
    age: 58,
    gender: "Male",
    bloodGroup: "O-",
    condition: "Heart Arrhythmia",
    lastVisit: "2024-01-18",
    nextAppointment: null,
    status: "Monitoring",
  },
  {
    id: 4,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+1 234 567 8904",
    age: 27,
    gender: "Female",
    bloodGroup: "AB+",
    condition: "Anxiety",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-01",
    status: "Stable",
  },
];

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<
    (typeof patientsData)[0] | null
  >(null);

  const filteredPatients = patientsData.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header title="My Patients" subtitle="View and manage your patients" />

      <div className="p-6">
        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search patients or conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={patient.name} size="lg" />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {patient.age} yrs, {patient.gender}
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
                    <span className="text-sm text-slate-600">
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
                  <Button size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-1" />
                    Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
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
              <Avatar fallback={selectedPatient.name} size="xl" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {selectedPatient.name}
                </h3>
                <p className="text-slate-500">
                  {selectedPatient.age} years old, {selectedPatient.gender}
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
                  {selectedPatient.bloodGroup}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Primary Condition</p>
                <p className="font-semibold text-slate-900">
                  {selectedPatient.condition}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="h-4 w-4" />
                {selectedPatient.email}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="h-4 w-4" />
                {selectedPatient.phone}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="h-4 w-4" />
                Last visit:{" "}
                {new Date(selectedPatient.lastVisit).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </div>
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
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setSelectedPatient(null)}>
            Close
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            View Full Records
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
