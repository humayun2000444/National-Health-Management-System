"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  qualification: string | null;
  experience: number | null;
  avatar: string | null;
  consultationFee: number;
  department: { id: number; name: string } | null;
  availableDays: string[];
  availableSlots: string[];
  rating: number;
  totalAppointments: number;
}

interface Department {
  value: string;
  label: string;
}

const appointmentTypes = [
  { value: "consultation", label: "Consultation" },
  { value: "followup", label: "Follow-up" },
  { value: "checkup", label: "General Checkup" },
];

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data from API
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Selection state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [symptoms, setSymptoms] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, [selectedDepartment]);

  const fetchDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (selectedDepartment) params.append("departmentId", selectedDepartment);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/patient/book?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch doctors");

      const data = await response.json();
      setDoctors(data.doctors);
      setDepartments(data.departments);
    } catch (err) {
      setError("Failed to load doctors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchDoctors();
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (!searchTerm) return true;
    return (
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setError("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/patient/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date: selectedDate,
          startTime: selectedSlot,
          type: appointmentType,
          symptoms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book appointment");
      }

      setSuccess("Appointment booked successfully!");
      setTimeout(() => {
        router.push("/patient/appointments");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (success) {
    return (
      <div className="min-h-screen">
        <Header
          title="Book Appointment"
          subtitle="Schedule a visit with our doctors"
        />
        <div className="p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Appointment Booked!
              </h2>
              <p className="text-slate-600 mb-4">{success}</p>
              <p className="text-sm text-slate-500">
                Redirecting to your appointments...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Book Appointment"
        subtitle="Schedule a visit with our doctors"
      />

      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s <= step
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    s <= step ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {s === 1
                    ? "Select Doctor"
                    : s === 2
                    ? "Choose Time"
                    : "Confirm"}
                </span>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-4 rounded ${
                      s < step ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search doctors..."
                  leftIcon={<Search className="h-4 w-4" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="w-48">
                <Select
                  options={departments}
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                />
              </div>
            </div>

            {/* Doctors Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className={`cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? "ring-2 ring-blue-600"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
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
                      <div className="space-y-2 text-sm">
                        {doctor.experience && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Experience</span>
                            <span className="font-medium">
                              {doctor.experience} years
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">
                              {doctor.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Consultation Fee</span>
                          <span className="font-semibold text-emerald-600">
                            ${doctor.consultationFee}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-500 mb-2">
                          Available Slots
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {doctor.availableSlots.slice(0, 3).map((slot) => (
                            <Badge key={slot} variant="secondary" size="sm">
                              {slot}
                            </Badge>
                          ))}
                          {doctor.availableSlots.length > 3 && (
                            <Badge variant="primary" size="sm">
                              +{doctor.availableSlots.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">No doctors found</p>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedDoctor}
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Date & Time */}
        {step === 2 && selectedDoctor && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Selected Doctor Summary */}
                  <div className="p-4 rounded-lg bg-slate-50 flex items-center gap-4">
                    <Avatar fallback={selectedDoctor.name} size="md" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {selectedDoctor.name}
                      </p>
                      <p className="text-sm text-blue-600">
                        {selectedDoctor.specialization}
                      </p>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Date
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={getMinDate()}
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedDoctor.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            selectedSlot === slot
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Clock className="h-4 w-4 inline mr-2" />
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Appointment Type */}
                  <Select
                    label="Appointment Type"
                    options={appointmentTypes}
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedSlot}
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && selectedDoctor && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Confirm Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Doctor Summary */}
                  <div className="p-4 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-4">
                      <Avatar fallback={selectedDoctor.name} size="lg" />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {selectedDoctor.name}
                        </p>
                        <p className="text-sm text-blue-600">
                          {selectedDoctor.specialization}
                        </p>
                        {selectedDoctor.department && (
                          <p className="text-xs text-slate-500">
                            {selectedDoctor.department.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Date</span>
                      </div>
                      <p className="font-semibold">
                        {selectedDate &&
                          new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Time</span>
                      </div>
                      <p className="font-semibold">{selectedSlot}</p>
                    </div>
                  </div>

                  {/* Appointment Type */}
                  <div className="p-4 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">Appointment Type</p>
                    <p className="font-semibold capitalize">{appointmentType}</p>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Describe your symptoms (optional)
                    </label>
                    <textarea
                      rows={4}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please describe your symptoms or reason for visit..."
                    />
                  </div>

                  {/* Fee Summary */}
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-emerald-900">
                        Consultation Fee
                      </span>
                      <span className="text-xl font-bold text-emerald-700">
                        ${selectedDoctor.consultationFee}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleSubmit} isLoading={submitting}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
