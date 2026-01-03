"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  Stethoscope,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Star,
  Clock,
  Calendar,
  FileText,
  CreditCard,
  TestTube,
  Activity,
  HeartHandshake,
  Phone,
  Ambulance,
  MapPin,
} from "lucide-react";

type UserType = "patient" | "doctor" | "admin";

const userTypes = [
  {
    type: "patient" as UserType,
    label: "Patient",
    icon: <User className="h-5 w-5" />,
    description: "Book appointments & access records",
    gradient: "from-teal-500 to-emerald-500",
    bgLight: "bg-teal-50",
    borderActive: "border-teal-500",
    ring: "ring-teal-500/20",
  },
  {
    type: "doctor" as UserType,
    label: "Doctor",
    icon: <Stethoscope className="h-5 w-5" />,
    description: "Manage patients & prescriptions",
    gradient: "from-sky-500 to-blue-500",
    bgLight: "bg-sky-50",
    borderActive: "border-sky-500",
    ring: "ring-sky-500/20",
  },
  {
    type: "admin" as UserType,
    label: "Admin",
    icon: <Shield className="h-5 w-5" />,
    description: "Full hospital management",
    gradient: "from-violet-500 to-purple-500",
    bgLight: "bg-violet-50",
    borderActive: "border-violet-500",
    ring: "ring-violet-500/20",
  },
];

const features = [
  { icon: <Calendar className="h-5 w-5" />, text: "Smart Appointment Scheduling" },
  { icon: <FileText className="h-5 w-5" />, text: "Digital Prescriptions & Records" },
  { icon: <TestTube className="h-5 w-5" />, text: "Lab Tests & Vital Signs" },
  { icon: <CreditCard className="h-5 w-5" />, text: "Multi-Currency Billing" },
  { icon: <Activity className="h-5 w-5" />, text: "Emergency Triage System" },
];

interface HospitalInfo {
  name: string;
  logo: string | null;
  phone: string | null;
  address: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  showHospitalName: boolean;
  showTagline: boolean;
  tagline: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<UserType>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);

  useEffect(() => {
    fetch("/api/public/hospital")
      .then((res) => res.json())
      .then((data) => setHospitalInfo(data))
      .catch((err) => console.error("Failed to fetch hospital info:", err));
  }, []);

  const hospitalName = hospitalInfo?.name || "City General Hospital";
  const hospitalLogo = hospitalInfo?.logo;
  const hospitalPhone = hospitalInfo?.phone || "+880 1234-567890";
  const showHospitalName = hospitalInfo?.showHospitalName ?? true;
  const showTagline = hospitalInfo?.showTagline ?? true;
  const tagline = hospitalInfo?.tagline || "Caring for You & Your Family";

  // Branding colors
  const primaryColor = hospitalInfo?.primaryColor || "#0d9488";
  const secondaryColor = hospitalInfo?.secondaryColor || "#059669";

  // Gradient styles using dynamic colors
  const gradientStyle = { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` };
  const gradientBrStyle = { background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` };

  const selectedUserType = userTypes.find((t) => t.type === selectedType)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn(`${selectedType}-credentials`, {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(`/${selectedType}`);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background - Dynamic theme */}
        <div className="absolute inset-0" style={gradientBrStyle} />

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {hospitalLogo ? (
              <div className={`rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 ${showHospitalName ? 'w-20 h-[45px]' : 'w-28 h-[63px]'}`}>
                <Image
                  src={hospitalLogo}
                  alt={hospitalName}
                  width={112}
                  height={63}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/30">
                <HeartHandshake className="h-7 w-7 text-white" />
              </div>
            )}
            {showHospitalName && (
              <div>
                <span className="text-2xl font-bold text-white">{hospitalName}</span>
                {showTagline && (
                  <span className="block text-sm text-teal-100">{tagline}</span>
                )}
              </div>
            )}
          </Link>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
              <HeartHandshake className="h-4 w-4" />
              Complete Hospital Management System
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Welcome to<br />{hospitalName}
            </h1>

            <p className="text-xl text-teal-100 leading-relaxed max-w-lg">
              Access your healthcare dashboard. Book appointments, view prescriptions,
              check lab results, and manage your health records securely.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    {feature.icon}
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-teal-100">Call Us</p>
                <p className="text-white font-semibold">{hospitalPhone}</p>
              </div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/80 rounded-lg">
                <Ambulance className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-teal-100">Emergency</p>
                <p className="text-white font-semibold">+880 1234-999999</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-b from-white to-teal-50/30">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              {hospitalLogo ? (
                <div className={`rounded-xl overflow-hidden shadow-lg border ${showHospitalName ? 'w-16 h-9' : 'w-20 h-[45px]'}`} style={{ borderColor: `${primaryColor}20` }}>
                  <Image
                    src={hospitalLogo}
                    alt={hospitalName}
                    width={80}
                    height={45}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="p-2.5 rounded-xl shadow-lg" style={gradientStyle}>
                  <HeartHandshake className="h-6 w-6 text-white" />
                </div>
              )}
              {showHospitalName && (
                <div className="text-left">
                  <span className="text-xl font-bold text-slate-900">{hospitalName}</span>
                  {showTagline && (
                    <span className="block text-xs" style={{ color: primaryColor }}>{tagline}</span>
                  )}
                </div>
              )}
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-slate-600">
              Access your healthcare management dashboard
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select your role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {userTypes.map((type) => (
                <button
                  key={type.type}
                  type="button"
                  onClick={() => setSelectedType(type.type)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedType === type.type
                      ? `${type.borderActive} ${type.bgLight} ring-4 ${type.ring}`
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-11 h-11 bg-gradient-to-r ${type.gradient} rounded-xl flex items-center justify-center text-white mx-auto mb-2 shadow-lg`}
                  >
                    {type.icon}
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {type.label}
                  </p>
                  {selectedType === type.type && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r ${type.gradient} rounded-full flex items-center justify-center`}>
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: primaryColor }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-gradient-to-r ${selectedUserType.gradient} text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In as {selectedUserType.label}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-5 bg-white rounded-2xl border shadow-sm" style={{ borderColor: `${primaryColor}20` }}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-semibold text-slate-700">
                Demo Credentials
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Admin:</span>
                <code className="text-slate-900 font-mono text-xs">admin@hospital.com / admin123</code>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Doctor:</span>
                <code className="text-slate-900 font-mono text-xs">doctor@hospital.com / doctor123</code>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Patient:</span>
                <code className="text-slate-900 font-mono text-xs">patient@hospital.com / patient123</code>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-slate-600">
            New patient?{" "}
            <Link
              href="/register"
              className="font-semibold transition-colors hover:opacity-80"
              style={{ color: primaryColor }}
            >
              Create Patient Account
            </Link>
          </p>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            By signing in, you agree to our{" "}
            <a href="#" className="text-slate-600 hover:text-slate-900">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-slate-600 hover:text-slate-900">Privacy Policy</a>
          </p>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
