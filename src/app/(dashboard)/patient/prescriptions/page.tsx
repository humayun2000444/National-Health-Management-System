"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import {
  Pill,
  Calendar,
  Download,
  Eye,
  Printer,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: number;
  doctor: string;
  specialization: string;
  avatar: string | null;
  date: string;
  diagnosis: string;
  medications: Medication[];
  instructions: string | null;
  validUntil: string | null;
  status: string;
}

interface PrescriptionCounts {
  active: number;
  expired: number;
  total: number;
}

interface HospitalInfo {
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
}

const filterOptions = [
  { value: "all", label: "All Prescriptions" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
];

export default function PatientPrescriptionsPage() {
  const { data: session } = useSession();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [counts, setCounts] = useState<PrescriptionCounts>({
    active: 0,
    expired: 0,
    total: 0,
  });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPrescriptions();
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

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/patient/prescriptions");
      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      const data = await response.json();
      setPrescriptions(data.prescriptions);
      setCounts(data.counts);
    } catch (err) {
      setError("Failed to load prescriptions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePrescriptionHTML = (prescription: Prescription) => {
    const medications = prescription.medications
      .map(
        (med, i) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${i + 1}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">${med.name}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${med.dosage || "-"}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${med.frequency || "-"}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${med.duration || "-"}</td>
        </tr>
      `
      )
      .join("");

    const hospitalLogo = hospitalInfo?.logo
      ? `<img src="${hospitalInfo.logo}" alt="${hospitalInfo.name}" style="height: 70px; width: auto; object-fit: contain;" />`
      : `<div style="width: 70px; height: 70px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">℞</div>`;

    const hospitalName = hospitalInfo?.name || "Medical Center";

    const hospitalDetailsRight = `
      <div style="text-align: right;">
        ${hospitalInfo?.address ? `<p style="color: #475569; font-size: 12px; margin-bottom: 3px;"><strong>Address:</strong> ${hospitalInfo.address}</p>` : ""}
        ${hospitalInfo?.phone ? `<p style="color: #475569; font-size: 12px; margin-bottom: 3px;"><strong>Phone:</strong> ${hospitalInfo.phone}</p>` : ""}
        ${hospitalInfo?.email ? `<p style="color: #475569; font-size: 12px; margin-bottom: 3px;"><strong>Email:</strong> ${hospitalInfo.email}</p>` : ""}
      </div>
    `;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${hospitalInfo?.name || "Medical Prescription"}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
          .hospital-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 3px solid #3b82f6; }
          .prescription-title { text-align: center; margin-bottom: 25px; }
          .prescription-title h1 { color: #3b82f6; font-size: 22px; margin-bottom: 5px; }
          .prescription-title p { color: #64748b; font-size: 14px; }
          .rx-symbol { font-size: 36px; color: #3b82f6; font-weight: bold; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
          .doctor-info { display: flex; gap: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; }
          .doctor-details h3 { font-size: 18px; margin-bottom: 5px; }
          .doctor-details p { color: #3b82f6; font-size: 14px; }
          .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; }
          .info-item label { font-size: 12px; color: #64748b; display: block; }
          .info-item span { font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #f1f5f9; padding: 12px 10px; text-align: left; border: 1px solid #e2e8f0; font-size: 12px; text-transform: uppercase; }
          .instructions { padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b; }
          .instructions p { color: #92400e; }
          .validity { display: flex; justify-content: space-between; padding: 15px; background: #f0fdf4; border-radius: 8px; }
          .validity.expired { background: #fef2f2; }
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
          ${hospitalDetailsRight}
        </div>

        <div class="prescription-title">
          <h1><span class="rx-symbol">℞</span> Medical Prescription</h1>
          <p>Date: ${new Date(prescription.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>

        <div class="section">
          <div class="section-title">Prescribing Doctor</div>
          <div class="doctor-info">
            <div class="doctor-details">
              <h3>${prescription.doctor}</h3>
              <p>${prescription.specialization}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="patient-info">
            <div class="info-item">
              <label>Patient Name</label>
              <span>${session?.user?.name || "Patient"}</span>
            </div>
            <div class="info-item">
              <label>Prescription ID</label>
              <span>#${prescription.id.toString().padStart(6, "0")}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Diagnosis</div>
          <p style="font-size: 16px; font-weight: 600; padding: 10px 0;">${prescription.diagnosis}</p>
        </div>

        <div class="section">
          <div class="section-title">Prescribed Medications</div>
          <table>
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              ${medications}
            </tbody>
          </table>
        </div>

        ${
          prescription.instructions
            ? `
        <div class="section">
          <div class="section-title">Special Instructions</div>
          <div class="instructions">
            <p>${prescription.instructions}</p>
          </div>
        </div>
        `
            : ""
        }

        <div class="section">
          <div class="validity ${prescription.status === "expired" ? "expired" : ""}">
            <div>
              <strong>Status:</strong>
              <span style="color: ${prescription.status === "active" ? "#16a34a" : "#dc2626"}; text-transform: uppercase;">
                ${prescription.status}
              </span>
            </div>
            ${
              prescription.validUntil
                ? `
            <div>
              <strong>Valid Until:</strong>
              ${new Date(prescription.validUntil).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
            `
                : ""
            }
          </div>
        </div>

        <div class="footer">
          <div class="hospital-footer">
            <p style="font-weight: 600; margin-bottom: 4px;">${hospitalInfo?.name || "Medical Center"}</p>
            ${hospitalInfo?.address ? `<p>${hospitalInfo.address}</p>` : ""}
            <p style="margin-top: 8px;">This is a computer-generated prescription.</p>
          </div>
          <div class="signature">
            <div class="signature-line">Doctor's Signature</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    if (!selectedPrescription) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(generatePrescriptionHTML(selectedPrescription));
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedPrescription) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const html = generatePrescriptionHTML(selectedPrescription);
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();

      // Add instruction for saving as PDF
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

  // Filter prescriptions locally
  const filteredPrescriptions = prescriptions.filter(
    (p) => filter === "all" || p.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="My Prescriptions"
          subtitle="View your medical prescriptions"
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
          title="My Prescriptions"
          subtitle="View your medical prescriptions"
        />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchPrescriptions}>
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
        title="My Prescriptions"
        subtitle="View your medical prescriptions"
      />

      <div className="p-6">
        {/* Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-sm text-emerald-600">
                <strong className="text-lg">{counts.active}</strong> Active
              </span>
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg">
              <span className="text-sm text-slate-600">
                <strong className="text-lg">{counts.expired}</strong> Expired
              </span>
            </div>
          </div>
          <Select
            options={filterOptions}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Doctor & Diagnosis */}
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={prescription.avatar || undefined}
                      fallback={prescription.doctor}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {prescription.doctor}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {prescription.specialization}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Diagnosis:{" "}
                        <span className="font-medium text-slate-700">
                          {prescription.diagnosis}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Medications Summary */}
                  <div className="flex-1 lg:mx-6">
                    <p className="text-sm text-slate-500 mb-2">Medications</p>
                    <div className="flex flex-wrap gap-2">
                      {prescription.medications.map((med, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg"
                        >
                          <Pill className="h-3 w-3 text-slate-500" />
                          <span className="text-sm">
                            {med.name} {med.dosage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <Badge
                      variant={
                        prescription.status === "active" ? "success" : "secondary"
                      }
                      className="capitalize"
                    >
                      {prescription.status}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(prescription.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPrescription(prescription)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPrescription(prescription);
                          setTimeout(() => handleDownloadPDF(), 100);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-12">
            <Pill className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No prescriptions found</p>
          </div>
        )}
      </div>

      {/* Prescription Details Modal */}
      <Modal
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
        title="Prescription Details"
        size="lg"
      >
        {selectedPrescription && (
          <div className="space-y-6" ref={printRef}>
            {/* Doctor Info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <Avatar
                src={selectedPrescription.avatar || undefined}
                fallback={selectedPrescription.doctor}
                size="lg"
              />
              <div>
                <p className="font-semibold text-slate-900">
                  {selectedPrescription.doctor}
                </p>
                <p className="text-sm text-blue-600">
                  {selectedPrescription.specialization}
                </p>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <p className="text-sm text-slate-500 mb-1">Diagnosis</p>
              <p className="font-semibold text-slate-900">
                {selectedPrescription.diagnosis}
              </p>
            </div>

            {/* Medications */}
            <div>
              <p className="text-sm text-slate-500 mb-3">Medications</p>
              <div className="space-y-3">
                {selectedPrescription.medications.map((med, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-slate-900">
                        {med.name}
                      </span>
                      {med.dosage && (
                        <Badge variant="secondary">{med.dosage}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {med.frequency && (
                        <div>
                          <span className="text-slate-500">Frequency:</span>{" "}
                          <span className="font-medium">{med.frequency}</span>
                        </div>
                      )}
                      {med.duration && (
                        <div>
                          <span className="text-slate-500">Duration:</span>{" "}
                          <span className="font-medium">{med.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            {selectedPrescription.instructions && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Instructions</p>
                <p className="text-slate-700">
                  {selectedPrescription.instructions}
                </p>
              </div>
            )}

            {/* Valid Until */}
            {selectedPrescription.validUntil && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500">Valid until:</span>
                <span className="font-medium">
                  {new Date(selectedPrescription.validUntil).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setSelectedPrescription(null)}
          >
            Close
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
