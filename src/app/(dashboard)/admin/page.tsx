"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  ChartCard,
  SimpleAreaChart,
  SimpleBarChart,
  SimplePieChart,
} from "@/components/dashboard/Charts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Stats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  monthlyRevenue: number;
  pendingAppointments: number;
  completedAppointments: number;
  departments: number;
  totalAppointments: number;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  patient: {
    name: string;
  };
  doctor: {
    name: string;
    department: {
      name: string;
    } | null;
  };
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  appointments: number;
  image: string | null;
}

interface WeeklyData {
  day: string;
  appointments: number;
}

interface DepartmentStats {
  name: string;
  appointments: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [topDoctors, setTopDoctors] = useState<Doctor[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      setStats(data.stats);
      setRecentAppointments(data.recentAppointments || []);
      setTopDoctors(data.topDoctors || []);
      setWeeklyData(data.weeklyData || []);
      setDepartmentStats(data.departmentStats || []);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Dashboard"
          subtitle="Loading..."
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
          subtitle="Error loading data"
        />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const barChartData = weeklyData.map((d) => ({
    name: d.day,
    appointments: d.appointments,
  }));

  const revenueData = weeklyData.map((d, i) => ({
    name: d.day,
    revenue: Math.round((stats?.monthlyRevenue || 0) / 30 * (i + 1)),
  }));

  const pieChartData = departmentStats
    .filter((d) => d.appointments > 0)
    .map((d, i) => ({
      name: d.name,
      value: d.appointments,
      color: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"][i % 6],
    }));

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${session?.user?.name || "Admin"}`}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Patients"
            value={stats?.totalPatients?.toLocaleString() || "0"}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12.5, isPositive: true }}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Total Doctors"
            value={stats?.totalDoctors?.toString() || "0"}
            icon={<Stethoscope className="h-6 w-6" />}
            trend={{ value: 4.2, isPositive: true }}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <StatsCard
            title="Appointments Today"
            value={stats?.todayAppointments?.toString() || "0"}
            icon={<Calendar className="h-6 w-6" />}
            trend={{ value: 8.1, isPositive: true }}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
          <StatsCard
            title="Revenue (Monthly)"
            value={`$${(stats?.monthlyRevenue || 0).toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 15.3, isPositive: true }}
            iconColor="text-violet-600"
            iconBg="bg-violet-100"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Weekly Appointments">
            {barChartData.length > 0 ? (
              <SimpleBarChart
                data={barChartData}
                dataKey="appointments"
                color="#2563eb"
                height={280}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                No appointment data available
              </div>
            )}
          </ChartCard>
          <ChartCard title="Revenue Overview">
            {revenueData.length > 0 ? (
              <SimpleAreaChart
                data={revenueData}
                dataKey="revenue"
                color="#10b981"
                height={280}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                No revenue data available
              </div>
            )}
          </ChartCard>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Appointments</CardTitle>
              <a
                href="/admin/appointments"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </a>
            </CardHeader>
            <CardContent>
              {recentAppointments.length > 0 ? (
                <div className="space-y-4">
                  {recentAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar fallback={apt.patient?.name || "P"} size="md" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {apt.patient?.name || "Unknown Patient"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {apt.doctor?.name || "Unknown Doctor"} - {apt.doctor?.department?.name || "General"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(apt.date).toLocaleDateString()} {apt.time}
                          </span>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No recent appointments
                </div>
              )}
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Department</CardTitle>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <SimplePieChart data={pieChartData} height={250} />
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  No department data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Doctors */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Performing Doctors</CardTitle>
            <a
              href="/admin/doctors"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </a>
          </CardHeader>
          <CardContent>
            {topDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topDoctors.map((doctor, index) => (
                  <div
                    key={doctor.id}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50"
                  >
                    <div className="relative">
                      <Avatar fallback={doctor.name} size="lg" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-slate-900">{doctor.name}</p>
                      <p className="text-sm text-slate-500">{doctor.specialization}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs text-emerald-600">
                          {doctor.appointments} appointments
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No doctor data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
