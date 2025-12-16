"use client";

import { useState } from "react";
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
} from "lucide-react";

const departments = [
  { value: "", label: "All Departments" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "dermatology", label: "Dermatology" },
];

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialization: "Cardiology",
    experience: 12,
    rating: 4.9,
    fee: 150,
    availableSlots: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    experience: 8,
    rating: 4.8,
    fee: 175,
    availableSlots: ["10:30 AM", "11:30 AM", "04:00 PM"],
  },
  {
    id: 3,
    name: "Dr. James Brown",
    specialization: "Orthopedics",
    experience: 15,
    rating: 4.7,
    fee: 125,
    availableSlots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:30 PM"],
  },
];

const appointmentTypes = [
  { value: "consultation", label: "Consultation" },
  { value: "followup", label: "Follow-up" },
  { value: "emergency", label: "Emergency" },
];

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [symptoms, setSymptoms] = useState("");

  const filteredDoctors = doctors.filter(
    (doc) =>
      !selectedDepartment ||
      doc.specialization.toLowerCase() === selectedDepartment
  );

  const handleSubmit = () => {
    // Handle booking submission
    console.log({
      doctor: selectedDoctor,
      date: selectedDate,
      slot: selectedSlot,
      type: appointmentType,
      symptoms,
    });
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Book Appointment"
        subtitle="Schedule a visit with our doctors"
      />

      <div className="p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={`cursor-pointer transition-all ${
                    selectedDoctor === doctor.id
                      ? "ring-2 ring-blue-600"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedDoctor(doctor.id)}
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
                      <div className="flex justify-between">
                        <span className="text-slate-500">Experience</span>
                        <span className="font-medium">
                          {doctor.experience} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Consultation Fee</span>
                        <span className="font-semibold text-emerald-600">
                          ${doctor.fee}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-500 mb-2">
                        Available Today
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
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Date
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {doctors
                        .find((d) => d.id === selectedDoctor)
                        ?.availableSlots.map((slot) => (
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
        {step === 3 && (
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
                      <Avatar
                        fallback={
                          doctors.find((d) => d.id === selectedDoctor)?.name ||
                          ""
                        }
                        size="lg"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {doctors.find((d) => d.id === selectedDoctor)?.name}
                        </p>
                        <p className="text-sm text-blue-600">
                          {
                            doctors.find((d) => d.id === selectedDoctor)
                              ?.specialization
                          }
                        </p>
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
                        ${doctors.find((d) => d.id === selectedDoctor)?.fee}
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
              <Button onClick={handleSubmit}>
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
