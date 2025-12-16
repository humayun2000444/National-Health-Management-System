"use client";

import { useSession } from "next-auth/react";
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
} from "lucide-react";

const todayAppointments = [
  {
    id: 1,
    patient: "John Smith",
    time: "09:00 AM",
    type: "Consultation",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Emily Davis",
    time: "10:30 AM",
    type: "Follow-up",
    status: "pending",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    time: "11:00 AM",
    type: "Consultation",
    status: "confirmed",
  },
  {
    id: 4,
    patient: "Lisa Anderson",
    time: "02:00 PM",
    type: "Emergency",
    status: "confirmed",
  },
  {
    id: 5,
    patient: "David Miller",
    time: "03:30 PM",
    type: "Consultation",
    status: "pending",
  },
];

const recentPatients = [
  {
    id: 1,
    name: "John Smith",
    lastVisit: "Today",
    condition: "Hypertension",
    status: "Ongoing",
  },
  {
    id: 2,
    name: "Emily Davis",
    lastVisit: "Yesterday",
    condition: "Diabetes Type 2",
    status: "Ongoing",
  },
  {
    id: 3,
    name: "Robert Johnson",
    lastVisit: "2 days ago",
    condition: "Heart Arrhythmia",
    status: "Monitoring",
  },
];

export default function DoctorDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle={`Good morning, ${session?.user?.name}`}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Today's Appointments"
            value="8"
            icon={<Calendar className="h-6 w-6" />}
            description="3 pending confirmation"
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Total Patients"
            value="124"
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 5.2, isPositive: true }}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <StatsCard
            title="Pending Reports"
            value="3"
            icon={<FileText className="h-6 w-6" />}
            description="Complete by today"
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
          <StatsCard
            title="Avg. Consultation"
            value="25 min"
            icon={<Clock className="h-6 w-6" />}
            description="Below average"
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
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
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
                      <Avatar fallback={apt.patient} size="md" />
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
                          apt.status === "confirmed" ? "success" : "warning"
                        }
                      >
                        {apt.status}
                      </Badge>
                      {apt.status === "pending" && (
                        <div className="flex gap-1">
                          <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Patients</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar fallback={patient.name} size="sm" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {patient.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {patient.lastVisit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">
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
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Write Prescription</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Calendar className="h-6 w-6 text-emerald-600" />
                <span>Schedule Appointment</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users className="h-6 w-6 text-violet-600" />
                <span>View Patient List</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Clock className="h-6 w-6 text-amber-600" />
                <span>Manage Schedule</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
