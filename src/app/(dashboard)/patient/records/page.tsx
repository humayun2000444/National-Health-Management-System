"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import {
  FileText,
  TestTube,
  Image,
  Syringe,
  Calendar,
  Download,
  Eye,
  Filter,
  Loader2,
  RefreshCw,
  Printer,
} from "lucide-react";

interface MedicalRecord {
  id: number;
  type: string;
  title: string;
  description: string | null;
  doctor: string;
  specialization: string;
  avatar: string | null;
  date: string;
  attachments: string[];
  createdAt: string;
}

interface RecordCounts {
  diagnosis: number;
  lab_report: number;
  imaging: number;
  vaccination: number;
  total: number;
}

interface HospitalInfo {
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
}

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

const typeLabels: Record<string, string> = {
  diagnosis: "Diagnosis",
  lab_report: "Lab Report",
  imaging: "Imaging",
  vaccination: "Vaccination",
};

export default function PatientRecordsPage() {
  const { data: session } = useSession();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [counts, setCounts] = useState<RecordCounts>({
    diagnosis: 0,
    lab_report: 0,
    imaging: 0,
    vaccination: 0,
    total: 0,
  });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);

  useEffect(() => {
    fetchRecords();
    fetchHospitalInfo();
  }, []);

  const fetchHospitalInfo = async () => {
    try {
      const response = await fetch("/api/hospital/info");
      if (response.ok) {
        const data = await response.json();
        setHospitalInfo(data);
      }
    } catch (err) {
      console.error("Failed to fetch hospital info:", err);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/patient/records");
      if (!response.ok) throw new Error("Failed to fetch records");
      const data = await response.json();
      setRecords(data.records);
      setCounts(data.counts);
    } catch (err) {
      setError("Failed to load medical records");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter records locally
  const filteredRecords = records.filter(
    (r) => filter === "all" || r.type === filter
  );

  const generateRecordHTML = (record: MedicalRecord) => {
    const hospitalLogo = hospitalInfo?.logo
      ? `<img src="${hospitalInfo.logo}" alt="${hospitalInfo.name}" style="height: 70px; width: auto; object-fit: contain;" />`
      : `<div style="width: 70px; height: 70px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">+</div>`;

    const hospitalName = hospitalInfo?.name || "Medical Center";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${record.title} - Medical Record</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
          .hospital-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 3px solid #3b82f6; }
          .record-title { text-align: center; margin-bottom: 30px; }
          .record-title h1 { color: #1e293b; font-size: 24px; margin-bottom: 8px; }
          .record-title .badge { display: inline-block; padding: 6px 16px; background: #e0f2fe; color: #0369a1; border-radius: 20px; font-size: 14px; text-transform: capitalize; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; color: #64748b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .info-item { padding: 15px; background: #f8fafc; border-radius: 8px; }
          .info-item label { font-size: 12px; color: #64748b; display: block; margin-bottom: 4px; }
          .info-item span { font-weight: 600; font-size: 15px; }
          .description-box { padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6; }
          .description-box p { line-height: 1.7; color: #475569; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-end; }
          .signature { text-align: center; }
          .signature-line { width: 200px; border-top: 1px solid #1e293b; margin-top: 60px; padding-top: 10px; }
          .hospital-footer { font-size: 11px; color: #64748b; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="hospital-header">
          <div style="display: flex; align-items: center; gap: 15px;">
            ${hospitalLogo}
            <div>
              <h2 style="color: #1e293b; font-size: 22px; font-weight: 700; margin: 0;">${hospitalName}</h2>
              <p style="color: #3b82f6; font-size: 13px; margin-top: 2px;">Healthcare Excellence</p>
            </div>
          </div>
          <div style="text-align: right;">
            ${hospitalInfo?.address ? `<p style="color: #475569; font-size: 12px; margin-bottom: 3px;"><strong>Address:</strong> ${hospitalInfo.address}</p>` : ""}
            ${hospitalInfo?.phone ? `<p style="color: #475569; font-size: 12px; margin-bottom: 3px;"><strong>Phone:</strong> ${hospitalInfo.phone}</p>` : ""}
            ${hospitalInfo?.email ? `<p style="color: #475569; font-size: 12px;"><strong>Email:</strong> ${hospitalInfo.email}</p>` : ""}
          </div>
        </div>

        <div class="record-title">
          <h1>${record.title}</h1>
          <span class="badge">${typeLabels[record.type] || record.type}</span>
        </div>

        <div class="section">
          <div class="section-title">Record Information</div>
          <div class="info-grid">
            <div class="info-item">
              <label>Patient Name</label>
              <span>${session?.user?.name || "Patient"}</span>
            </div>
            <div class="info-item">
              <label>Record ID</label>
              <span>#${record.id.toString().padStart(6, "0")}</span>
            </div>
            <div class="info-item">
              <label>Record Date</label>
              <span>${new Date(record.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
            <div class="info-item">
              <label>Record Type</label>
              <span style="text-transform: capitalize;">${typeLabels[record.type] || record.type}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Attending Physician</div>
          <div class="info-grid">
            <div class="info-item">
              <label>Doctor Name</label>
              <span>${record.doctor}</span>
            </div>
            <div class="info-item">
              <label>Specialization</label>
              <span>${record.specialization}</span>
            </div>
          </div>
        </div>

        ${record.description ? `
        <div class="section">
          <div class="section-title">Details & Findings</div>
          <div class="description-box">
            <p>${record.description}</p>
          </div>
        </div>
        ` : ""}

        <div class="footer">
          <div class="hospital-footer">
            <p style="font-weight: 600; margin-bottom: 4px;">${hospitalName}</p>
            ${hospitalInfo?.address ? `<p>${hospitalInfo.address}</p>` : ""}
            <p style="margin-top: 8px;">This is a computer-generated medical record.</p>
          </div>
          <div class="signature">
            <div class="signature-line">Authorized Signature</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    if (!selectedRecord) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(generateRecordHTML(selectedRecord));
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownload = (record?: MedicalRecord) => {
    const recordToDownload = record || selectedRecord;
    if (!recordToDownload) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const html = generateRecordHTML(recordToDownload);
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();

      const instruction = printWindow.document.createElement("div");
      instruction.className = "no-print";
      instruction.style.cssText = "position: fixed; top: 0; left: 0; right: 0; background: #3b82f6; color: white; padding: 15px; text-align: center; z-index: 9999;";
      instruction.innerHTML = `
        <strong>To save as PDF:</strong> Press Ctrl+P (or Cmd+P on Mac), then select "Save as PDF" as the destination.
        <button onclick="window.print(); this.parentElement.style.display='none';" style="margin-left: 15px; padding: 8px 16px; background: white; color: #3b82f6; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
          Save as PDF
        </button>
      `;
      printWindow.document.body.insertBefore(instruction, printWindow.document.body.firstChild);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Medical Records"
          subtitle="View your complete medical history"
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
          title="Medical Records"
          subtitle="View your complete medical history"
        />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchRecords}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold">{counts.diagnosis}</p>
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
                <p className="text-2xl font-bold">{counts.lab_report}</p>
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
                <p className="text-2xl font-bold">{counts.imaging}</p>
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
                <p className="text-2xl font-bold">{counts.vaccination}</p>
                <p className="text-sm text-slate-500">Vaccinations</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            All Records ({counts.total})
          </h2>
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
                          <Avatar
                            src={record.avatar || undefined}
                            fallback={record.doctor}
                            size="xs"
                          />
                          <span className="text-sm text-slate-500">
                            {record.doctor}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" size="sm" className="capitalize">
                          {typeLabels[record.type] || record.type.replace("_", " ")}
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
                    {record.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {record.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(record)}
                      >
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

      {/* Record Details Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="Medical Record Details"
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-6">
            {/* Record Header */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div
                className={`p-3 rounded-xl ${
                  typeColors[selectedRecord.type] || "bg-slate-100 text-slate-600"
                }`}
              >
                {typeIcons[selectedRecord.type] || <FileText className="h-6 w-6" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 text-lg">
                  {selectedRecord.title}
                </h3>
                <Badge variant="secondary" size="sm" className="mt-1 capitalize">
                  {typeLabels[selectedRecord.type] || selectedRecord.type.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {/* Record Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Record Date</p>
                <p className="font-medium">
                  {new Date(selectedRecord.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Record ID</p>
                <p className="font-medium">#{selectedRecord.id.toString().padStart(6, "0")}</p>
              </div>
            </div>

            {/* Doctor Info */}
            <div>
              <p className="text-sm text-slate-500 mb-2">Attending Physician</p>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Avatar
                  src={selectedRecord.avatar || undefined}
                  fallback={selectedRecord.doctor}
                  size="md"
                />
                <div>
                  <p className="font-medium text-slate-900">{selectedRecord.doctor}</p>
                  <p className="text-sm text-blue-600">{selectedRecord.specialization}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedRecord.description && (
              <div>
                <p className="text-sm text-slate-500 mb-2">Details & Findings</p>
                <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {selectedRecord.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setSelectedRecord(null)}>
            Close
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={() => handleDownload()}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
