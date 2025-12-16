"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";

interface HospitalSettings {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  subscription: string;
  settings: {
    onlineBooking: boolean;
    prescriptions: boolean;
    medicalRecords: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
    appointmentReminder: number;
    replyToEmail: string;
  };
}

const colorPresets = [
  { name: "Blue", primary: "#2563eb", secondary: "#1e40af" },
  { name: "Green", primary: "#059669", secondary: "#047857" },
  { name: "Purple", primary: "#7c3aed", secondary: "#6d28d9" },
  { name: "Red", primary: "#dc2626", secondary: "#b91c1c" },
  { name: "Orange", primary: "#ea580c", secondary: "#c2410c" },
  { name: "Teal", primary: "#0d9488", secondary: "#0f766e" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [hospitalName, setHospitalName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");

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

  // Notification settings
  const [appointmentReminder, setAppointmentReminder] = useState(24);
  const [replyToEmail, setReplyToEmail] = useState("");

  // Subscription
  const [subscription, setSubscription] = useState("free");

  // Logo
  const [logo, setLogo] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data: HospitalSettings = await response.json();

      setHospitalName(data.name);
      setEmail(data.email);
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setWebsite(data.website || "");
      setPrimaryColor(data.primaryColor);
      setSecondaryColor(data.secondaryColor);
      setAccentColor(data.accentColor);
      setSubscription(data.subscription);
      setLogo(data.logo);

      if (data.settings) {
        setFeatures({
          onlineBooking: data.settings.onlineBooking ?? true,
          prescriptions: data.settings.prescriptions ?? true,
          medicalRecords: data.settings.medicalRecords ?? true,
          smsNotifications: data.settings.smsNotifications ?? false,
          emailNotifications: data.settings.emailNotifications ?? true,
        });
        setAppointmentReminder(data.settings.appointmentReminder ?? 24);
        setReplyToEmail(data.settings.replyToEmail ?? "");
      }
    } catch (err) {
      setError("Failed to load settings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const response = await fetch("/api/admin/settings/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload logo");
      }

      const data = await response.json();
      setLogo(data.logo);
      setSuccess("Logo uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = async () => {
    if (!confirm("Are you sure you want to remove the logo?")) return;

    setIsUploadingLogo(true);
    setError("");

    try {
      const response = await fetch("/api/admin/settings/upload-logo", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove logo");

      setLogo(null);
      setSuccess("Logo removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to remove logo");
      console.error(err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (section: string) => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      let updateData: Record<string, unknown> = {};

      switch (section) {
        case "general":
          updateData = {
            name: hospitalName,
            email,
            phone,
            address,
            website,
          };
          break;
        case "branding":
          updateData = {
            primaryColor,
            secondaryColor,
            accentColor,
          };
          break;
        case "features":
          updateData = {
            settings: {
              ...features,
              appointmentReminder,
              replyToEmail,
            },
          };
          break;
        case "notifications":
          updateData = {
            settings: {
              ...features,
              appointmentReminder,
              replyToEmail,
            },
          };
          break;
      }

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save settings");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <Building2 className="h-4 w-4" /> },
    { id: "branding", label: "Branding", icon: <Palette className="h-4 w-4" /> },
    { id: "features", label: "Features", icon: <Shield className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Settings" subtitle="Customize your hospital settings and branding" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Settings"
        subtitle="Customize your hospital settings and branding"
      />

      <div className="p-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
            <Button variant="ghost" size="sm" onClick={fetchSettings} className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        )}

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

            {/* Subscription Info */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Current Plan</p>
                <Badge variant={subscription === "premium" ? "success" : "secondary"}>
                  {subscription.charAt(0).toUpperCase() + subscription.slice(1)}
                </Badge>
                {subscription === "free" && (
                  <p className="text-xs text-slate-500 mt-2">
                    Upgrade to Premium for SMS notifications and more features.
                  </p>
                )}
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
                        <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden">
                          {logo ? (
                            <img
                              src={logo}
                              alt="Hospital Logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-8 w-8 text-slate-400" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/gif,image/webp"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploadingLogo}
                            >
                              {isUploadingLogo ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              {logo ? "Change Logo" : "Upload Logo"}
                            </Button>
                            {logo && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRemoveLogo}
                                disabled={isUploadingLogo}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            PNG, JPG, GIF, WebP up to 2MB. Recommended: 512x512px
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
                      <Button onClick={() => handleSave("general")} isLoading={isSaving}>
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
                          {hospitalName || "Your Hospital"}
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
                      <Button onClick={() => handleSave("branding")} isLoading={isSaving}>
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
                        badge: subscription === "free" ? "Premium" : undefined,
                        disabled: subscription === "free",
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
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          feature.disabled ? "bg-slate-100" : "bg-slate-50"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${
                              feature.disabled ? "text-slate-500" : "text-slate-900"
                            }`}>
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
                            disabled={feature.disabled}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                            feature.disabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}></div>
                        </label>
                      </div>
                    ))}

                    <div className="flex justify-end pt-4">
                      <Button onClick={() => handleSave("features")} isLoading={isSaving}>
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

                    {subscription === "free" && (
                      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-sm text-amber-800">
                          <strong>Note:</strong> SMS notifications require a
                          premium subscription. Upgrade your plan to enable this
                          feature.
                        </p>
                      </div>
                    )}

                    <div className="space-y-4 pt-4">
                      <Input
                        label="Appointment Reminder (hours before)"
                        type="number"
                        value={appointmentReminder}
                        onChange={(e) => setAppointmentReminder(parseInt(e.target.value) || 24)}
                        hint="Send reminder notification this many hours before appointment"
                      />
                      <Input
                        label="Reply-to Email"
                        type="email"
                        value={replyToEmail}
                        onChange={(e) => setReplyToEmail(e.target.value)}
                        placeholder="noreply@hospital.com"
                        hint="Email address used for notification replies"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={() => handleSave("notifications")} isLoading={isSaving}>
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
