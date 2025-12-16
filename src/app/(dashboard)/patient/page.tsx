"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  RefreshCw,
} from "lucide-react";

interface DashboardData {
  stats: {
    upcomingAppointments: number;
    nextAppointment: string;
    activePrescriptions: number;
    medicalRecords: number;
    totalVisits: number;
  };
  appointments: Array<{
    id: number;
    doctor: string;
    specialization: string;
    avatar: string | null;
    department: string;
    date: string;
    time: string;
    status: string;
    type: string;
  }>;
  prescriptions: Array<{
    id: number;
    doctor: string;
    date: string;
    medications: string[];
    status: string;
  }>;
  patient: {
    name: string;
    bloodGroup: string | null;
    allergies: string | null;
    chronicConditions: string | null;
  };
}

export default function PatientDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/patient/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard");
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="My Dashboard"
          subtitle={`Welcome back, ${session?.user?.name}`}
        />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <Header
          title="My Dashboard"
          subtitle={`Welcome back, ${session?.user?.name}`}
        />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error || "No data available"}</p>
          <Button onClick={fetchDashboard}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { stats, appointments, prescriptions, patient } = data;

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
            value={stats.upcomingAppointments.toString()}
            icon={<Calendar className="h-6 w-6" />}
            description={`Next: ${stats.nextAppointment}`}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Active Prescriptions"
            value={stats.activePrescriptions.toString()}
            icon={<Pill className="h-6 w-6" />}
            description="View all prescriptions"
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <StatsCard
            title="Medical Records"
            value={stats.medicalRecords.toString()}
            icon={<FileText className="h-6 w-6" />}
            description="View your records"
            iconColor="text-violet-600"
            iconBg="bg-violet-100"
          />
          <StatsCard
            title="Total Visits"
            value={stats.totalVisits.toString()}
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
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
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

          {/* Health Info */}
          <Card>
            <CardHeader>
              <CardTitle>Health Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.bloodGroup && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div>
                      <p className="text-sm text-slate-500">Blood Group</p>
                      <p className="font-semibold text-slate-900">
                        {patient.bloodGroup}
                      </p>
                    </div>
                    <Badge variant="primary">{patient.bloodGroup}</Badge>
                  </div>
                )}
                {patient.allergies && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      Allergies
                    </p>
                    <p className="text-sm text-red-700">{patient.allergies}</p>
                  </div>
                )}
                {patient.chronicConditions && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <p className="text-sm font-medium text-amber-800 mb-1">
                      Chronic Conditions
                    </p>
                    <p className="text-sm text-amber-700">
                      {patient.chronicConditions}
                    </p>
                  </div>
                )}
                {!patient.bloodGroup &&
                  !patient.allergies &&
                  !patient.chronicConditions && (
                    <div className="text-center py-4">
                      <p className="text-slate-500 text-sm">
                        No health information on file
                      </p>
                      <Link href="/patient/profile">
                        <Button variant="outline" size="sm" className="mt-2">
                          Update Profile
                        </Button>
                      </Link>
                    </div>
                  )}
              </div>
              {(patient.allergies || patient.chronicConditions) && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Health Reminder
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Always inform your doctor about your health conditions
                        before any consultation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
            {prescriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-slate-900">
                        {prescription.doctor}
                      </p>
                      <Badge
                        variant={
                          prescription.status === "active" ? "success" : "secondary"
                        }
                      >
                        {prescription.status}
                      </Badge>
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
            ) : (
              <div className="text-center py-8">
                <Pill className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No active prescriptions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
