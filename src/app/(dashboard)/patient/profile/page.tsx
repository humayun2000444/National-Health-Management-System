"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Save, Upload, User, Heart, Phone, Shield } from "lucide-react";

const bloodGroupOptions = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function PatientProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "+1 234 567 8901",
    dateOfBirth: "1990-05-15",
    gender: "male",
    bloodGroup: "A+",
    address: "123 Main Street, City, State 12345",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 234 567 8902",
    allergies: "Penicillin, Peanuts",
    chronicConditions: "Hypertension",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: <User className="h-4 w-4" /> },
    { id: "medical", label: "Medical Info", icon: <Heart className="h-4 w-4" /> },
    { id: "emergency", label: "Emergency Contact", icon: <Phone className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen">
      <Header title="My Profile" subtitle="Manage your personal information" />

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            {/* Profile Card */}
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <Avatar
                  fallback={session?.user?.name || "U"}
                  size="xl"
                  className="mx-auto mb-4"
                />
                <h3 className="font-semibold text-slate-900">
                  {session?.user?.name}
                </h3>
                <p className="text-sm text-slate-500">{session?.user?.email}</p>
                <Badge variant="primary" className="mt-2">
                  Patient
                </Badge>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Personal Info */}
            {activeTab === "personal" && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Gender"
                        options={genderOptions}
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      />
                      <Select
                        label="Blood Group"
                        options={bloodGroupOptions}
                        value={formData.bloodGroup}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bloodGroup: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Input
                      label="Address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSave} isLoading={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medical Info */}
            {activeTab === "medical" && (
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Known Allergies
                      </label>
                      <textarea
                        rows={3}
                        value={formData.allergies}
                        onChange={(e) =>
                          setFormData({ ...formData, allergies: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="List any known allergies..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Chronic Conditions
                      </label>
                      <textarea
                        rows={3}
                        value={formData.chronicConditions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            chronicConditions: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="List any chronic conditions..."
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSave} isLoading={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contact */}
            {activeTab === "emergency" && (
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      label="Contact Name"
                      value={formData.emergencyContact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyContact: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Contact Phone"
                      value={formData.emergencyPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyPhone: e.target.value,
                        })
                      }
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSave} isLoading={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSave} isLoading={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
