"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  ChartCard,
  SimpleLineChart,
  SimpleBarChart,
  SimplePieChart,
  MultiLineChart,
} from "@/components/dashboard/Charts";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";

const monthlyData = [
  { name: "Jan", appointments: 245, patients: 120, revenue: 45000 },
  { name: "Feb", appointments: 312, patients: 145, revenue: 52000 },
  { name: "Mar", appointments: 289, patients: 132, revenue: 48000 },
  { name: "Apr", appointments: 378, patients: 168, revenue: 61000 },
  { name: "May", appointments: 356, patients: 155, revenue: 58000 },
  { name: "Jun", appointments: 425, patients: 189, revenue: 72000 },
];

const departmentPerformance = [
  { name: "Cardiology", appointments: 89 },
  { name: "Neurology", appointments: 67 },
  { name: "Orthopedics", appointments: 54 },
  { name: "Pediatrics", appointments: 78 },
  { name: "Dermatology", appointments: 45 },
];

const appointmentStatus = [
  { name: "Completed", value: 65, color: "#10b981" },
  { name: "Confirmed", value: 20, color: "#2563eb" },
  { name: "Pending", value: 10, color: "#f59e0b" },
  { name: "Cancelled", value: 5, color: "#ef4444" },
];

const doctorPerformance = [
  { name: "Dr. Wilson", patients: 48, rating: 4.9 },
  { name: "Dr. Chen", patients: 42, rating: 4.8 },
  { name: "Dr. Brown", patients: 38, rating: 4.7 },
  { name: "Dr. Parker", patients: 35, rating: 4.6 },
  { name: "Dr. Kim", patients: 52, rating: 4.8 },
];

const periodOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("30d");

  return (
    <div className="min-h-screen">
      <Header title="Reports & Analytics" subtitle="Hospital performance insights" />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="flex gap-4">
            <div className="w-48">
              <Select
                options={periodOptions}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Appointments</p>
                  <p className="text-xl font-bold text-slate-900">2,005</p>
                  <p className="text-xs text-emerald-600">+12.5% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">New Patients</p>
                  <p className="text-xl font-bold text-slate-900">909</p>
                  <p className="text-xs text-emerald-600">+8.2% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="text-xl font-bold text-slate-900">$336,000</p>
                  <p className="text-xs text-emerald-600">+15.3% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Activity className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Completion Rate</p>
                  <p className="text-xl font-bold text-slate-900">94.2%</p>
                  <p className="text-xs text-emerald-600">+2.1% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Monthly Trends">
            <MultiLineChart
              data={monthlyData}
              lines={[
                { dataKey: "appointments", color: "#2563eb", name: "Appointments" },
                { dataKey: "patients", color: "#10b981", name: "New Patients" },
              ]}
              height={300}
            />
          </ChartCard>
          <ChartCard title="Revenue Over Time">
            <SimpleLineChart
              data={monthlyData}
              dataKey="revenue"
              color="#8b5cf6"
              height={300}
            />
          </ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ChartCard title="Appointments by Department">
            <SimpleBarChart
              data={departmentPerformance}
              dataKey="appointments"
              color="#2563eb"
              height={250}
            />
          </ChartCard>
          <ChartCard title="Appointment Status">
            <SimplePieChart data={appointmentStatus} height={250} />
          </ChartCard>
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {doctorPerformance.map((doctor, index) => (
                  <div
                    key={doctor.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{doctor.name}</p>
                        <p className="text-xs text-slate-500">
                          {doctor.patients} patients
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Peak Hours
                </p>
                <p className="text-lg font-bold text-blue-700">9 AM - 11 AM</p>
                <p className="text-xs text-blue-600 mt-1">
                  Most appointments scheduled during this time
                </p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-sm font-medium text-emerald-900 mb-1">
                  Busiest Day
                </p>
                <p className="text-lg font-bold text-emerald-700">Wednesday</p>
                <p className="text-xs text-emerald-600 mt-1">
                  Average 45 appointments per Wednesday
                </p>
              </div>
              <div className="p-4 rounded-lg bg-violet-50 border border-violet-100">
                <p className="text-sm font-medium text-violet-900 mb-1">
                  Avg. Wait Time
                </p>
                <p className="text-lg font-bold text-violet-700">12 minutes</p>
                <p className="text-xs text-violet-600 mt-1">
                  Down from 18 minutes last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
