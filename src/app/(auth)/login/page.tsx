"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Heart, Mail, Lock, ArrowRight, User, Stethoscope, Shield } from "lucide-react";

type UserType = "patient" | "doctor" | "admin";

const userTypes = [
  {
    type: "patient" as UserType,
    label: "Patient",
    icon: <User className="h-5 w-5" />,
    description: "Book appointments & view records",
    color: "bg-blue-500",
  },
  {
    type: "doctor" as UserType,
    label: "Doctor",
    icon: <Stethoscope className="h-5 w-5" />,
    description: "Manage patients & appointments",
    color: "bg-emerald-500",
  },
  {
    type: "admin" as UserType,
    label: "Admin",
    icon: <Shield className="h-5 w-5" />,
    description: "Full hospital management",
    color: "bg-violet-500",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<UserType>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setError("Invalid email or password");
      } else {
        router.push(`/${selectedType}`);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-10 w-10 text-white" />
            <span className="text-2xl font-bold text-white">HealthCare Pro</span>
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to the Future of Healthcare Management
          </h1>
          <p className="text-xl text-blue-100">
            Streamline operations, enhance patient care, and grow your practice
            with our comprehensive platform.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-blue-200">Hospitals</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">2M+</p>
            <p className="text-blue-200">Patients</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">99.9%</p>
            <p className="text-blue-200">Uptime</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">
                HealthCare Pro
              </span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h2>
          <p className="text-slate-600 mb-8">
            Select your account type and enter your credentials
          </p>

          {/* User Type Selection */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {userTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => setSelectedType(type.type)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedType === type.type
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center text-white mx-auto mb-2`}
                >
                  {type.icon}
                </div>
                <p className="font-medium text-slate-900 text-sm">
                  {type.label}
                </p>
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In as {userTypes.find((t) => t.type === selectedType)?.label}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-slate-100 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-sm text-slate-600">
              <p>
                <strong>Admin:</strong> admin@hospital.com / admin123
              </p>
              <p>
                <strong>Doctor:</strong> doctor@hospital.com / doctor123
              </p>
              <p>
                <strong>Patient:</strong> patient@hospital.com / patient123
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register as Patient
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
