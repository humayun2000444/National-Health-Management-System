"use client";

import { useState, useEffect } from "react";
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
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface ReportData {
  summary: {
    totalAppointments: number;
    appointmentChange: string;
    newPatients: number;
    patientChange: string;
    totalRevenue: number;
    revenueChange: string;
    completionRate: string;
  };
  appointmentStatus: Array<{ name: string; value: number; color: string }>;
  departmentPerformance: Array<{ name: string; appointments: number }>;
  doctorPerformance: Array<{ name: string; patients: number; department: string }>;
  monthlyData: Array<{ name: string; appointments: number; revenue: number }>;
  insights: {
    peakHours: string;
    busiestDay: string;
    avgAppointmentsPerDay: number;
  };
}

const periodOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/reports?period=${period}`);
      if (!response.ok) throw new Error("Failed to fetch reports");
      const reportData = await response.json();
      setData(reportData);
    } catch (err) {
      setError("Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatChange = (change: string) => {
    const value = parseFloat(change);
    const isPositive = value >= 0;
    return {
      text: `${isPositive ? "+" : ""}${change}% from last period`,
      isPositive,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Reports & Analytics" subtitle="Hospital performance insights" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <Header title="Reports & Analytics" subtitle="Hospital performance insights" />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error || "No data available"}</p>
          <Button onClick={fetchReports}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { summary, appointmentStatus, departmentPerformance, doctorPerformance, monthlyData, insights } = data;

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
            <Button variant="outline" onClick={fetchReports}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
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
                  <p className="text-xl font-bold text-slate-900">
                    {summary.totalAppointments.toLocaleString()}
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${
                    parseFloat(summary.appointmentChange) >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {parseFloat(summary.appointmentChange) >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatChange(summary.appointmentChange).text}
                  </p>
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
                  <p className="text-xl font-bold text-slate-900">
                    {summary.newPatients.toLocaleString()}
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${
                    parseFloat(summary.patientChange) >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {parseFloat(summary.patientChange) >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatChange(summary.patientChange).text}
                  </p>
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
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(summary.totalRevenue)}
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${
                    parseFloat(summary.revenueChange) >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {parseFloat(summary.revenueChange) >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatChange(summary.revenueChange).text}
                  </p>
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
                  <p className="text-xl font-bold text-slate-900">
                    {summary.completionRate}%
                  </p>
                  <p className="text-xs text-slate-500">
                    Of all appointments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Appointment Trends">
            {monthlyData.length > 0 ? (
              <SimpleLineChart
                data={monthlyData}
                dataKey="appointments"
                color="#2563eb"
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                No data available for this period
              </div>
            )}
          </ChartCard>
          <ChartCard title="Revenue Over Time">
            {monthlyData.length > 0 ? (
              <SimpleLineChart
                data={monthlyData}
                dataKey="revenue"
                color="#8b5cf6"
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                No data available for this period
              </div>
            )}
          </ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ChartCard title="Appointments by Department">
            {departmentPerformance.length > 0 ? (
              <SimpleBarChart
                data={departmentPerformance}
                dataKey="appointments"
                color="#2563eb"
                height={250}
              />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-500">
                No department data
              </div>
            )}
          </ChartCard>
          <ChartCard title="Appointment Status">
            {appointmentStatus.length > 0 ? (
              <SimplePieChart data={appointmentStatus} height={250} />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-500">
                No status data
              </div>
            )}
          </ChartCard>
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              {doctorPerformance.length > 0 ? (
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
                            {doctor.department}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{doctor.patients}</p>
                        <p className="text-xs text-slate-500">appointments</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-slate-500">
                  No doctor data
                </div>
              )}
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
                <p className="text-lg font-bold text-blue-700">{insights.peakHours}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Most appointments scheduled during this time
                </p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-sm font-medium text-emerald-900 mb-1">
                  Busiest Day
                </p>
                <p className="text-lg font-bold text-emerald-700">{insights.busiestDay}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  Highest appointment volume
                </p>
              </div>
              <div className="p-4 rounded-lg bg-violet-50 border border-violet-100">
                <p className="text-sm font-medium text-violet-900 mb-1">
                  Daily Average
                </p>
                <p className="text-lg font-bold text-violet-700">
                  {insights.avgAppointmentsPerDay} appointments
                </p>
                <p className="text-xs text-violet-600 mt-1">
                  Average appointments per day
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
