"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Save, Clock, Calendar } from "lucide-react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialSchedule = {
  Monday: { enabled: true, start: "09:00", end: "17:00" },
  Tuesday: { enabled: true, start: "09:00", end: "17:00" },
  Wednesday: { enabled: true, start: "09:00", end: "17:00" },
  Thursday: { enabled: true, start: "09:00", end: "17:00" },
  Friday: { enabled: true, start: "09:00", end: "15:00" },
  Saturday: { enabled: false, start: "10:00", end: "14:00" },
  Sunday: { enabled: false, start: "10:00", end: "14:00" },
};

const upcomingLeaves = [
  { id: 1, date: "2024-02-14", reason: "Personal" },
  { id: 2, date: "2024-02-28", reason: "Conference" },
];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [slotDuration, setSlotDuration] = useState("30");
  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day as keyof typeof schedule],
        enabled: !schedule[day as keyof typeof schedule].enabled,
      },
    });
  };

  const updateTime = (day: string, type: "start" | "end", value: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day as keyof typeof schedule],
        [type]: value,
      },
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen">
      <Header title="Schedule" subtitle="Manage your availability" />

      <div className="p-6">
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
                      schedule[day as keyof typeof schedule].enabled
                        ? "bg-white border-slate-200"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule[day as keyof typeof schedule].enabled}
                        onChange={() => toggleDay(day)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>

                    <span
                      className={`font-medium w-28 ${
                        schedule[day as keyof typeof schedule].enabled
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {day}
                    </span>

                    {schedule[day as keyof typeof schedule].enabled ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="time"
                          value={schedule[day as keyof typeof schedule].start}
                          onChange={(e) =>
                            updateTime(day, "start", e.target.value)
                          }
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="time"
                          value={schedule[day as keyof typeof schedule].end}
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
                <Button onClick={handleSave} isLoading={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
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
                      {
                        Object.values(schedule).filter((d) => d.enabled)
                          .length
                      }{" "}
                      days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Total Hours/Week</span>
                    <span className="font-semibold text-slate-900">
                      40 hours
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Slots/Day</span>
                    <span className="font-semibold text-slate-900">
                      16 slots
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Leaves</CardTitle>
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingLeaves.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingLeaves.map((leave) => (
                      <div
                        key={leave.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {new Date(leave.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-slate-500">
                            {leave.reason}
                          </p>
                        </div>
                        <Badge variant="warning">Leave</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-4">
                    No upcoming leaves scheduled
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
