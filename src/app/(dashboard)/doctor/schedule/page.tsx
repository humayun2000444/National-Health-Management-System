"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Save, Clock, Calendar, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

interface Schedule {
  [key: string]: DaySchedule;
}

interface Summary {
  workingDays: number;
  totalHours: number;
  slotsPerDay: number;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultSchedule: Schedule = {
  Monday: { enabled: true, start: "09:00", end: "17:00" },
  Tuesday: { enabled: true, start: "09:00", end: "17:00" },
  Wednesday: { enabled: true, start: "09:00", end: "17:00" },
  Thursday: { enabled: true, start: "09:00", end: "17:00" },
  Friday: { enabled: true, start: "09:00", end: "15:00" },
  Saturday: { enabled: false, start: "10:00", end: "14:00" },
  Sunday: { enabled: false, start: "10:00", end: "14:00" },
};

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);
  const [slotDuration, setSlotDuration] = useState("30");
  const [summary, setSummary] = useState<Summary>({
    workingDays: 5,
    totalHours: 40,
    slotsPerDay: 16,
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/doctor/schedule");
      if (!response.ok) throw new Error("Failed to fetch schedule");

      const data = await response.json();
      setSchedule(data.schedule || defaultSchedule);
      setSlotDuration(data.slotDuration?.toString() || "30");
      setSummary(data.summary || { workingDays: 5, totalHours: 40, slotsPerDay: 16 });
    } catch (err) {
      console.error(err);
      // Use default schedule if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    const currentDay = schedule[day] || { enabled: false, start: "09:00", end: "17:00" };
    setSchedule({
      ...schedule,
      [day]: {
        ...currentDay,
        enabled: !currentDay.enabled,
      },
    });
  };

  const updateTime = (day: string, type: "start" | "end", value: string) => {
    const currentDay = schedule[day] || { enabled: true, start: "09:00", end: "17:00" };
    setSchedule({
      ...schedule,
      [day]: {
        ...currentDay,
        [type]: value,
      },
    });
  };

  const calculateSummary = (): Summary => {
    const workingDays = Object.values(schedule).filter((d) => d.enabled).length;
    const totalHours = Object.values(schedule).reduce((acc, day) => {
      if (!day.enabled) return acc;
      const [startH, startM] = day.start.split(":").map(Number);
      const [endH, endM] = day.end.split(":").map(Number);
      const hours = (endH + endM / 60) - (startH + startM / 60);
      return acc + hours;
    }, 0);
    const avgHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0;
    const slotsPerDay = Math.floor(avgHoursPerDay * (60 / parseInt(slotDuration)));

    return {
      workingDays,
      totalHours: Math.round(totalHours),
      slotsPerDay,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/doctor/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule,
          slotDuration: parseInt(slotDuration),
        }),
      });

      if (!response.ok) throw new Error("Failed to save schedule");

      setSuccess("Schedule saved successfully!");
      setSummary(calculateSummary());
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save schedule");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Update summary when schedule or slot duration changes
  useEffect(() => {
    setSummary(calculateSummary());
  }, [schedule, slotDuration]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Schedule" subtitle="Manage your availability" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Schedule" subtitle="Manage your availability" />

      <div className="p-6">
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      schedule[day]?.enabled
                        ? "bg-white border-slate-200"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule[day]?.enabled || false}
                        onChange={() => toggleDay(day)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>

                    <span
                      className={`font-medium w-28 ${
                        schedule[day]?.enabled
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {day}
                    </span>

                    {schedule[day]?.enabled ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="time"
                          value={schedule[day]?.start || "09:00"}
                          onChange={(e) =>
                            updateTime(day, "start", e.target.value)
                          }
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="time"
                          value={schedule[day]?.end || "17:00"}
                          onChange={(e) =>
                            updateTime(day, "end", e.target.value)
                          }
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">
                        Not Available
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Slot Duration */}
              <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Appointment Slot Duration
                      </p>
                      <p className="text-sm text-slate-500">
                        Time allocated for each appointment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={slotDuration}
                      onChange={(e) => setSlotDuration(e.target.value)}
                      min="15"
                      max="60"
                      step="15"
                      className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-slate-500">minutes</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Schedule Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Working Days</span>
                    <span className="font-semibold text-slate-900">
                      {summary.workingDays} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Total Hours/Week</span>
                    <span className="font-semibold text-slate-900">
                      {summary.totalHours} hours
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Avg Slots/Day</span>
                    <span className="font-semibold text-slate-900">
                      {summary.slotsPerDay} slots
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Set realistic working hours to avoid burnout</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Consider buffer time between appointments</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <p>30-minute slots work best for consultations</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Patients can only book during your available hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>This Week</CardTitle>
                <Calendar className="h-5 w-5 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-600">Total Capacity</p>
                    <p className="text-xl font-bold text-blue-700">
                      {summary.workingDays * summary.slotsPerDay} appointments
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Based on your current schedule settings
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
