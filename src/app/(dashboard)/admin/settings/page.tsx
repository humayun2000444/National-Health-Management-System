"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Building2,
  Palette,
  Bell,
  Shield,
  Save,
  Upload,
  Check,
} from "lucide-react";

const colorPresets = [
  { name: "Blue", primary: "#2563eb", secondary: "#1e40af" },
  { name: "Green", primary: "#059669", secondary: "#047857" },
  { name: "Purple", primary: "#7c3aed", secondary: "#6d28d9" },
  { name: "Red", primary: "#dc2626", secondary: "#b91c1c" },
  { name: "Orange", primary: "#ea580c", secondary: "#c2410c" },
  { name: "Teal", primary: "#0d9488", secondary: "#0f766e" },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [hospitalName, setHospitalName] = useState(
    session?.user?.hospitalName || "City Hospital"
  );
  const [email, setEmail] = useState("admin@hospital.com");
  const [phone, setPhone] = useState("+1 234 567 8900");
  const [address, setAddress] = useState("123 Medical Center Drive, City, State 12345");
  const [website, setWebsite] = useState("https://hospital.com");

  // Branding
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [secondaryColor, setSecondaryColor] = useState("#1e40af");
  const [accentColor, setAccentColor] = useState("#10b981");

  // Feature toggles
  const [features, setFeatures] = useState({
    onlineBooking: true,
    prescriptions: true,
    medicalRecords: true,
    smsNotifications: false,
    emailNotifications: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const tabs = [
    { id: "general", label: "General", icon: <Building2 className="h-4 w-4" /> },
    { id: "branding", label: "Branding", icon: <Palette className="h-4 w-4" /> },
    { id: "features", label: "Features", icon: <Shield className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Settings"
        subtitle="Customize your hospital settings and branding"
      />

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
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
            {/* General Settings */}
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Hospital Logo
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                          <Building2 className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                          <p className="text-xs text-slate-500 mt-1">
                            PNG, JPG up to 2MB. Recommended: 512x512px
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Hospital Name"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <Input
                        label="Website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>

                    <Input
                      label="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
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

            {/* Branding Settings */}
            {activeTab === "branding" && (
              <Card>
                <CardHeader>
                  <CardTitle>Branding & Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Color Presets */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Color Presets
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              setPrimaryColor(preset.primary);
                              setSecondaryColor(preset.secondary);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                              primaryColor === preset.primary
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div
                              className="w-5 h-5 rounded-full"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <span className="text-sm font-medium">
                              {preset.name}
                            </span>
                            {primaryColor === preset.primary && (
                              <Check className="h-4 w-4 text-blue-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Preview
                      </label>
                      <div
                        className="p-6 rounded-xl"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <h3 className="text-xl font-bold text-white mb-2">
                          {hospitalName}
                        </h3>
                        <p className="text-white/80 mb-4">
                          Your hospital branding preview
                        </p>
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium"
                          style={{
                            backgroundColor: accentColor,
                            color: "white",
                          }}
                        >
                          Book Appointment
                        </button>
                      </div>
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

            {/* Features Settings */}
            {activeTab === "features" && (
              <Card>
                <CardHeader>
                  <CardTitle>Feature Toggles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        key: "onlineBooking",
                        label: "Online Appointment Booking",
                        description:
                          "Allow patients to book appointments online",
                      },
                      {
                        key: "prescriptions",
                        label: "Digital Prescriptions",
                        description:
                          "Enable doctors to create digital prescriptions",
                      },
                      {
                        key: "medicalRecords",
                        label: "Medical Records",
                        description:
                          "Allow patients to view their medical records",
                      },
                      {
                        key: "smsNotifications",
                        label: "SMS Notifications",
                        description:
                          "Send SMS reminders for appointments",
                        badge: "Premium",
                      },
                      {
                        key: "emailNotifications",
                        label: "Email Notifications",
                        description:
                          "Send email reminders for appointments",
                      },
                    ].map((feature) => (
                      <div
                        key={feature.key}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">
                              {feature.label}
                            </p>
                            {feature.badge && (
                              <Badge variant="warning" size="sm">
                                {feature.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">
                            {feature.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              features[feature.key as keyof typeof features]
                            }
                            onChange={(e) =>
                              setFeatures({
                                ...features,
                                [feature.key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSave} isLoading={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-500">
                      Configure how and when notifications are sent to patients
                      and staff.
                    </p>

                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <strong>Note:</strong> SMS notifications require a
                        premium subscription. Upgrade your plan to enable this
                        feature.
                      </p>
                    </div>

                    <div className="space-y-4 pt-4">
                      <Input
                        label="Appointment Reminder (hours before)"
                        type="number"
                        defaultValue="24"
                        hint="Send reminder notification this many hours before appointment"
                      />
                      <Input
                        label="Reply-to Email"
                        type="email"
                        defaultValue="noreply@hospital.com"
                        hint="Email address used for notification replies"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSave} isLoading={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
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
