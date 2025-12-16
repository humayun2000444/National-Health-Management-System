"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  FileText,
  Clock,
  ChevronRight,
  Pill,
  Activity,
  AlertCircle,
} from "lucide-react";

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Wilson",
    specialization: "Cardiology",
    date: "2024-01-25",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialization: "Neurology",
    date: "2024-02-05",
    time: "02:30 PM",
    status: "pending",
  },
];

const recentPrescriptions = [
  {
    id: 1,
    doctor: "Dr. Sarah Wilson",
    date: "2024-01-20",
    medications: ["Lisinopril 10mg", "Aspirin 81mg"],
    status: "active",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    date: "2024-01-15",
    medications: ["Metformin 500mg"],
    status: "active",
  },
];

const healthMetrics = [
  { label: "Blood Pressure", value: "120/80", status: "normal" },
  { label: "Heart Rate", value: "72 bpm", status: "normal" },
  { label: "Blood Sugar", value: "110 mg/dL", status: "warning" },
];

export default function PatientDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      <Header
        title="My Dashboard"
        subtitle={`Welcome back, ${session?.user?.name}`}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Upcoming Appointments"
            value="2"
            icon={<Calendar className="h-6 w-6" />}
            description="Next: Jan 25"
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Active Prescriptions"
            value="3"
            icon={<Pill className="h-6 w-6" />}
            description="2 refills needed"
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <StatsCard
            title="Medical Records"
            value="12"
            icon={<FileText className="h-6 w-6" />}
            description="Last updated: Jan 20"
            iconColor="text-violet-600"
            iconBg="bg-violet-100"
          />
          <StatsCard
            title="Total Visits"
            value="8"
            icon={<Activity className="h-6 w-6" />}
            description="This year"
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <Link href="/patient/book">
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
              <Link href="/patient/prescriptions">
                <Button variant="outline">
                  <Pill className="h-4 w-4 mr-2" />
                  View Prescriptions
                </Button>
              </Link>
              <Link href="/patient/records">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Medical Records
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Link href="/patient/appointments">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar fallback={apt.doctor} size="lg" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {apt.doctor}
                          </p>
                          <p className="text-sm text-slate-500">
                            {apt.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(apt.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 mt-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{apt.time}</span>
                        </div>
                        <Badge
                          variant={
                            apt.status === "confirmed" ? "success" : "warning"
                          }
                          className="mt-2"
                        >
                          {apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No upcoming appointments</p>
                  <Link href="/patient/book">
                    <Button className="mt-3">Book Now</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div>
                      <p className="text-sm text-slate-500">{metric.label}</p>
                      <p className="font-semibold text-slate-900">
                        {metric.value}
                      </p>
                    </div>
                    <Badge
                      variant={
                        metric.status === "normal" ? "success" : "warning"
                      }
                    >
                      {metric.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Attention Needed
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Your blood sugar levels are slightly elevated. Consider
                      scheduling a follow-up.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Prescriptions */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Prescriptions</CardTitle>
            <Link href="/patient/prescriptions">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-slate-900">
                      {prescription.doctor}
                    </p>
                    <Badge variant="success">{prescription.status}</Badge>
                  </div>
                  <div className="space-y-1">
                    {prescription.medications.map((med, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{med}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Prescribed on{" "}
                    {new Date(prescription.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
