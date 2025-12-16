"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  FileText,
  TestTube,
  Image,
  Syringe,
  Calendar,
  Download,
  Eye,
  Filter,
} from "lucide-react";

const recordsData = [
  {
    id: 1,
    type: "diagnosis",
    title: "Hypertension Diagnosis",
    doctor: "Dr. Sarah Wilson",
    date: "2024-01-20",
    description:
      "Patient diagnosed with Stage 1 hypertension. Blood pressure reading: 140/90 mmHg.",
  },
  {
    id: 2,
    type: "lab_report",
    title: "Complete Blood Count (CBC)",
    doctor: "Dr. Michael Chen",
    date: "2024-01-18",
    description:
      "All values within normal range. WBC: 7.5, RBC: 4.8, Hemoglobin: 14.2",
  },
  {
    id: 3,
    type: "imaging",
    title: "Chest X-Ray",
    doctor: "Dr. James Brown",
    date: "2024-01-15",
    description: "No significant abnormalities detected. Heart size normal.",
  },
  {
    id: 4,
    type: "vaccination",
    title: "Flu Vaccine",
    doctor: "Dr. Sarah Wilson",
    date: "2024-01-10",
    description: "Seasonal influenza vaccine administered. No adverse reactions.",
  },
  {
    id: 5,
    type: "lab_report",
    title: "Lipid Panel",
    doctor: "Dr. Sarah Wilson",
    date: "2024-01-05",
    description:
      "Total Cholesterol: 210, LDL: 130, HDL: 45, Triglycerides: 150",
  },
];

const typeOptions = [
  { value: "all", label: "All Records" },
  { value: "diagnosis", label: "Diagnosis" },
  { value: "lab_report", label: "Lab Reports" },
  { value: "imaging", label: "Imaging" },
  { value: "vaccination", label: "Vaccinations" },
];

const typeIcons: Record<string, React.ReactNode> = {
  diagnosis: <FileText className="h-5 w-5" />,
  lab_report: <TestTube className="h-5 w-5" />,
  imaging: <Image className="h-5 w-5" />,
  vaccination: <Syringe className="h-5 w-5" />,
};

const typeColors: Record<string, string> = {
  diagnosis: "bg-blue-100 text-blue-600",
  lab_report: "bg-emerald-100 text-emerald-600",
  imaging: "bg-purple-100 text-purple-600",
  vaccination: "bg-amber-100 text-amber-600",
};

export default function PatientRecordsPage() {
  const [filter, setFilter] = useState("all");

  const filteredRecords = recordsData.filter(
    (r) => filter === "all" || r.type === filter
  );

  return (
    <div className="min-h-screen">
      <Header
        title="Medical Records"
        subtitle="View your complete medical history"
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {recordsData.filter((r) => r.type === "diagnosis").length}
                </p>
                <p className="text-sm text-slate-500">Diagnoses</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TestTube className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {recordsData.filter((r) => r.type === "lab_report").length}
                </p>
                <p className="text-sm text-slate-500">Lab Reports</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Image className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {recordsData.filter((r) => r.type === "imaging").length}
                </p>
                <p className="text-sm text-slate-500">Imaging</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Syringe className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {recordsData.filter((r) => r.type === "vaccination").length}
                </p>
                <p className="text-sm text-slate-500">Vaccinations</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">All Records</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select
              options={typeOptions}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Records Timeline */}
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div
                    className={`p-3 rounded-xl h-fit ${
                      typeColors[record.type] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {typeIcons[record.type] || <FileText className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {record.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar fallback={record.doctor} size="xs" />
                          <span className="text-sm text-slate-500">
                            {record.doctor}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" size="sm">
                          {record.type.replace("_", " ")}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(record.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      {record.description}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
}
