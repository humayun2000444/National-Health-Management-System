"use client";

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
} from "lucide-react";

// Sample data for charts
const appointmentData = [
  { name: "Mon", appointments: 24 },
  { name: "Tue", appointments: 18 },
  { name: "Wed", appointments: 32 },
  { name: "Thu", appointments: 27 },
  { name: "Fri", appointments: 21 },
  { name: "Sat", appointments: 15 },
  { name: "Sun", appointments: 8 },
];

const revenueData = [
  { name: "Jan", revenue: 4500 },
  { name: "Feb", revenue: 5200 },
  { name: "Mar", revenue: 4800 },
  { name: "Apr", revenue: 6100 },
  { name: "May", revenue: 5800 },
  { name: "Jun", revenue: 7200 },
];

const departmentData = [
  { name: "Cardiology", value: 35, color: "#2563eb" },
  { name: "Neurology", value: 25, color: "#10b981" },
  { name: "Orthopedics", value: 20, color: "#f59e0b" },
  { name: "Pediatrics", value: 20, color: "#8b5cf6" },
];

const recentAppointments = [
  {
    id: 1,
    patient: "John Smith",
    doctor: "Dr. Sarah Wilson",
    time: "09:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Emily Davis",
    doctor: "Dr. Michael Chen",
    time: "10:30 AM",
    status: "pending",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    doctor: "Dr. Sarah Wilson",
    time: "11:00 AM",
    status: "confirmed",
  },
  {
    id: 4,
    patient: "Lisa Anderson",
    doctor: "Dr. James Brown",
    time: "02:00 PM",
    status: "cancelled",
  },
  {
    id: 5,
    patient: "David Miller",
    doctor: "Dr. Michael Chen",
    time: "03:30 PM",
    status: "confirmed",
  },
];

const topDoctors = [
  { id: 1, name: "Dr. Sarah Wilson", specialty: "Cardiology", patients: 48, rating: 4.9 },
  { id: 2, name: "Dr. Michael Chen", specialty: "Neurology", patients: 42, rating: 4.8 },
  { id: 3, name: "Dr. James Brown", specialty: "Orthopedics", patients: 38, rating: 4.7 },
];

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${session?.user?.name}`}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Patients"
            value="2,847"
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12.5, isPositive: true }}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Total Doctors"
            value="48"
            icon={<Stethoscope className="h-6 w-6" />}
            trend={{ value: 4.2, isPositive: true }}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <StatsCard
            title="Appointments Today"
            value="145"
            icon={<Calendar className="h-6 w-6" />}
            trend={{ value: 8.1, isPositive: true }}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
          <StatsCard
            title="Revenue (Monthly)"
            value="$72,450"
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 15.3, isPositive: true }}
            iconColor="text-violet-600"
            iconBg="bg-violet-100"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Weekly Appointments">
            <SimpleBarChart
              data={appointmentData}
              dataKey="appointments"
              color="#2563eb"
              height={280}
            />
          </ChartCard>
          <ChartCard title="Revenue Overview">
            <SimpleAreaChart
              data={revenueData}
              dataKey="revenue"
              color="#10b981"
              height={280}
            />
          </ChartCard>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar fallback={apt.patient} size="md" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {apt.patient}
                        </p>
                        <p className="text-sm text-slate-500">{apt.doctor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{apt.time}</span>
                      </div>
                      <Badge
                        variant={
                          apt.status === "confirmed"
                            ? "success"
                            : apt.status === "pending"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <SimplePieChart data={departmentData} height={250} />
            </CardContent>
          </Card>
        </div>

        {/* Top Doctors */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Top Performing Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topDoctors.map((doctor, index) => (
                <div
                  key={doctor.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-50"
                >
                  <div className="relative">
                    <Avatar fallback={doctor.name} size="lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{doctor.name}</p>
                    <p className="text-sm text-slate-500">{doctor.specialty}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-500">
                        {doctor.patients} patients
                      </span>
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <TrendingUp className="h-3 w-3" />
                        {doctor.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
