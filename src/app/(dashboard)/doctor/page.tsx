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
  Users,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  ChevronRight,
  Loader2,
  AlertCircle,
  Activity,
  FlaskConical,
} from "lucide-react";
import { ChartCard, SimpleBarChart, Sparkline } from "@/components/dashboard/Charts";

interface Appointment {
  id: number;
  patient: string;
  patientAvatar: string | null;
  time: string;
  type: string;
  status: string;
  symptoms: string | null;
}

interface RecentPatient {
  id: number;
  name: string;
  avatar: string | null;
  lastVisit: string;
  condition: string;
  status: string;
}

interface WeeklyData {
  day: string;
  appointments: number;
}

interface DashboardData {
  stats: {
    todayAppointments: number;
    pendingConfirmation: number;
    totalPatients: number;
    pendingReports: number;
  };
  todaySchedule: Appointment[];
  recentPatients: RecentPatient[];
  weeklyStats?: WeeklyData[];
  appointmentTrend?: number[];
}

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/doctor/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    setUpdatingId(appointmentId);
    try {
      const response = await fetch("/api/doctor/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status }),
      });

      if (!response.ok) throw new Error("Failed to update appointment");

      // Refresh dashboard
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatLastVisit = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Dashboard"
          subtitle={`${getGreeting()}, ${session?.user?.name}`}
        />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="Dashboard"
          subtitle={`${getGreeting()}, ${session?.user?.name}`}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-slate-600">{error}</p>
            <Button onClick={fetchDashboard} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle={`${getGreeting()}, Dr. ${session?.user?.name}`}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Today's Appointments"
            value={data?.stats.todayAppointments?.toString() || "0"}
            icon={<Calendar className="h-6 w-6" />}
            description={`${data?.stats.pendingConfirmation || 0} pending confirmation`}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Total Patients"
            value={data?.stats.totalPatients?.toString() || "0"}
            icon={<Users className="h-6 w-6" />}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <StatsCard
            title="Recent Prescriptions"
            value={data?.stats.pendingReports?.toString() || "0"}
            icon={<FileText className="h-6 w-6" />}
            description="This week"
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
          <StatsCard
            title="Avg. Consultation"
            value="30 min"
            icon={<Clock className="h-6 w-6" />}
            description="Per appointment"
            iconColor="text-violet-600"
            iconBg="bg-violet-100"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Schedule</CardTitle>
              <Link href="/doctor/appointments">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {data?.todaySchedule && data.todaySchedule.length > 0 ? (
                <div className="space-y-3">
                  {data.todaySchedule.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <p className="text-sm font-semibold text-slate-900">
                            {apt.time}
                          </p>
                        </div>
                        <div className="h-10 w-px bg-slate-200" />
                        <Avatar
                          src={apt.patientAvatar || undefined}
                          fallback={apt.patient}
                          size="md"
                        />
                        <div>
                          <p className="font-medium text-slate-900">
                            {apt.patient}
                          </p>
                          <p className="text-sm text-slate-500">{apt.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            apt.status === "confirmed"
                              ? "success"
                              : apt.status === "completed"
                              ? "info"
                              : "warning"
                          }
                        >
                          {apt.status}
                        </Badge>
                        {apt.status === "pending" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
                              disabled={updatingId === apt.id}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {updatingId === apt.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <CheckCircle className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                              disabled={updatingId === apt.id}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No appointments scheduled for today</p>
                  <Link href="/doctor/appointments">
                    <Button variant="outline" size="sm" className="mt-4">
                      View All Appointments
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Patients</CardTitle>
              <Link href="/doctor/patients">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {data?.recentPatients && data.recentPatients.length > 0 ? (
                <div className="space-y-4">
                  {data.recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar
                          src={patient.avatar || undefined}
                          fallback={patient.name}
                          size="sm"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {patient.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatLastVisit(patient.lastVisit)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600 truncate max-w-[150px]">
                          {patient.condition}
                        </p>
                        <Badge
                          variant={
                            patient.status === "Ongoing" ? "primary" : "info"
                          }
                          size="sm"
                        >
                          {patient.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No recent patients</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Link href="/doctor/prescriptions">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span>Write Prescription</span>
                </Button>
              </Link>
              <Link href="/doctor/appointments">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                  <span>View Appointments</span>
                </Button>
              </Link>
              <Link href="/doctor/patients">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                  <Users className="h-6 w-6 text-violet-600" />
                  <span>View Patients</span>
                </Button>
              </Link>
              <Link href="/doctor/lab-tests">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                  <FlaskConical className="h-6 w-6 text-pink-600" />
                  <span>Lab Tests</span>
                </Button>
              </Link>
              <Link href="/doctor/vitals">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                  <Activity className="h-6 w-6 text-red-600" />
                  <span>Vital Signs</span>
                </Button>
              </Link>
              <Link href="/doctor/schedule">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <span>Manage Schedule</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Analytics */}
        {data?.weeklyStats && data.weeklyStats.length > 0 && (
          <div className="mt-6">
            <ChartCard title="This Week's Appointments">
              <SimpleBarChart
                data={data.weeklyStats}
                dataKey="appointments"
                color="#2563eb"
                height={200}
              />
            </ChartCard>
          </div>
        )}

        {/* Mini Trend Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-600">Appointment Trend</p>
                <Badge variant="success" size="sm">+12%</Badge>
              </div>
              {data?.appointmentTrend && data.appointmentTrend.length > 0 ? (
                <Sparkline data={data.appointmentTrend} color="#10b981" height={60} />
              ) : (
                <Sparkline data={[3, 5, 4, 6, 8, 7, 9]} color="#10b981" height={60} />
              )}
              <p className="text-xs text-slate-500 mt-2">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-600">Patient Growth</p>
                <Badge variant="primary" size="sm">+{data?.stats.totalPatients || 0}</Badge>
              </div>
              <Sparkline data={[2, 4, 3, 5, 7, 6, 8]} color="#2563eb" height={60} />
              <p className="text-xs text-slate-500 mt-2">Active patients this month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
