"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Heart,
  Shield,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Check,
  ArrowRight,
  Star,
  Building2,
  Stethoscope,
  Clock,
  Globe,
  Zap,
  Lock,
  ChevronRight,
  Play,
  Phone,
  Mail,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Menu,
  X,
  Award,
  TrendingUp,
  Headphones,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
}

const features = [
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Smart Scheduling",
    description:
      "AI-powered appointment booking with intelligent scheduling that reduces wait times by 60% and eliminates double-booking.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Digital Health Records",
    description:
      "Secure EHR/EMR system with instant access to complete patient history, lab results, and imaging from anywhere.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Patient Portal",
    description:
      "Self-service portal for appointment booking, prescription refills, telemedicine, and health tracking.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Real-time Analytics",
    description:
      "Comprehensive dashboards with KPIs, revenue tracking, patient satisfaction metrics, and predictive insights.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Enterprise Security",
    description:
      "HIPAA, GDPR, and SOC 2 compliant with end-to-end encryption, audit trails, and role-based access control.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Multi-Location Support",
    description:
      "Manage multiple facilities, departments, and branches from a single unified platform with location-based settings.",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const testimonials = [
  {
    quote:
      "HealthCare Pro has revolutionized our hospital operations. We've seen a 45% reduction in administrative workload and patient satisfaction scores have never been higher.",
    author: "Dr. Sarah Wilson",
    role: "Chief Medical Officer",
    hospital: "Johns Hopkins Medicine",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    quote:
      "The ROI was immediate. Within 3 months, we recovered our investment through improved efficiency and reduced no-shows. The analytics alone are worth the subscription.",
    author: "James Rodriguez",
    role: "Hospital Administrator",
    hospital: "Mayo Clinic",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    quote:
      "Finally, a system that doctors actually want to use. The interface is intuitive, the mobile app is fantastic, and the support team is incredibly responsive.",
    author: "Dr. Emily Chen",
    role: "Head of Cardiology",
    hospital: "Cleveland Clinic",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "299",
    period: "month",
    description: "Perfect for small clinics and private practices",
    features: [
      "Up to 5 healthcare providers",
      "500 patient records",
      "Basic appointment scheduling",
      "Patient portal access",
      "Email support",
      "Basic analytics dashboard",
      "Mobile app access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "799",
    period: "month",
    description: "For growing hospitals and medical centers",
    features: [
      "Up to 50 healthcare providers",
      "Unlimited patient records",
      "Advanced scheduling & reminders",
      "Digital prescriptions",
      "Priority 24/7 support",
      "Advanced analytics & reports",
      "Custom branding",
      "API access",
      "Telemedicine integration",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large healthcare networks and hospital chains",
    features: [
      "Unlimited providers & locations",
      "Unlimited everything",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment option",
      "Custom SLA guarantee",
      "Staff training included",
      "HIPAA BAA agreement",
      "Custom feature development",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const partners = [
  "Microsoft Healthcare",
  "Google Cloud",
  "AWS Healthcare",
  "Epic Systems",
  "Cerner",
  "Philips Healthcare",
];

const faqs = [
  {
    question: "How long does implementation take?",
    answer:
      "Most clinics are up and running within 2-4 weeks. Enterprise implementations typically take 6-12 weeks depending on complexity and integration requirements.",
  },
  {
    question: "Is my data secure and HIPAA compliant?",
    answer:
      "Absolutely. We maintain HIPAA, GDPR, and SOC 2 Type II compliance. All data is encrypted at rest and in transit with 256-bit AES encryption.",
  },
  {
    question: "Can I migrate data from my existing system?",
    answer:
      "Yes, we provide free data migration services for all plans. Our team will help transfer your patient records, appointments, and other data securely.",
  },
  {
    question: "Do you offer training for staff?",
    answer:
      "Yes, all plans include access to our online training resources. Professional and Enterprise plans include live training sessions and ongoing support.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stat1 = useCounter(500, 2000);
  const stat2 = useCounter(2, 2000);
  const stat3 = useCounter(99, 2000);
  const stat4 = useCounter(45, 2000);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stat1.setIsVisible(true);
            stat2.setIsVisible(true);
            stat3.setIsVisible(true);
            stat4.setIsVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );
    const statsSection = document.getElementById("stats-section");
    if (statsSection) observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur-lg opacity-50" />
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-2.5 rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                HealthCare Pro
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                Testimonials
              </a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/login"
                className="text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-6 space-y-4">
            <a href="#features" className="block text-slate-600 hover:text-slate-900 font-medium">Features</a>
            <a href="#pricing" className="block text-slate-600 hover:text-slate-900 font-medium">Pricing</a>
            <a href="#testimonials" className="block text-slate-600 hover:text-slate-900 font-medium">Testimonials</a>
            <a href="#faq" className="block text-slate-600 hover:text-slate-900 font-medium">FAQ</a>
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <Link href="/login" className="block text-center py-2.5 text-slate-700 font-medium">Sign In</Link>
              <Link href="/login" className="block text-center py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-full">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-r from-violet-400/10 to-purple-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium mb-8 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 500+ Healthcare Providers Worldwide</span>
              <ChevronRight className="h-4 w-4" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              The Future of{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  Healthcare
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 4 298 10" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#2563eb"/>
                      <stop offset="1" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              Management is Here
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Streamline operations, enhance patient care, and scale your healthcare
              business with our AI-powered hospital management platform trusted by
              leading medical institutions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/login"
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Free 14-Day Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-semibold rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Free data migration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 lg:mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 pointer-events-none h-32 bottom-0 top-auto" />

            {/* Floating Elements */}
            <div className="absolute -left-4 top-1/4 bg-white rounded-2xl shadow-xl p-4 hidden lg:block animate-bounce z-10" style={{ animationDuration: "3s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">+45%</p>
                  <p className="text-xs text-slate-500">Efficiency</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-1/3 bg-white rounded-2xl shadow-xl p-4 hidden lg:block animate-bounce z-10" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">2M+</p>
                  <p className="text-xs text-slate-500">Patients</p>
                </div>
              </div>
            </div>

            {/* Main Dashboard Image Container */}
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl lg:rounded-3xl p-2 lg:p-3 shadow-2xl shadow-slate-900/20 mx-4 lg:mx-0">
              <div className="bg-slate-800 rounded-xl lg:rounded-2xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-600/50 rounded-lg px-4 py-1.5 text-xs text-slate-400 flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      app.healthcarepro.com/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 aspect-[16/9] p-6 lg:p-8">
                  <div className="grid grid-cols-4 gap-4 h-full">
                    {/* Sidebar */}
                    <div className="col-span-1 bg-white rounded-xl shadow-sm p-4 hidden lg:block">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Heart className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">HealthCare Pro</span>
                      </div>
                      <div className="space-y-2">
                        {["Dashboard", "Appointments", "Patients", "Doctors", "Reports"].map((item, i) => (
                          <div key={i} className={`px-3 py-2 rounded-lg text-xs ${i === 0 ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600"}`}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-4 lg:col-span-3 space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { label: "Total Patients", value: "2,847", color: "blue", trend: "+12%" },
                          { label: "Appointments", value: "145", color: "emerald", trend: "+8%" },
                          { label: "Revenue", value: "$72.4K", color: "violet", trend: "+23%" },
                          { label: "Satisfaction", value: "98%", color: "amber", trend: "+5%" },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white rounded-xl p-3 lg:p-4 shadow-sm">
                            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                            <p className="text-lg lg:text-xl font-bold text-slate-900">{stat.value}</p>
                            <p className={`text-xs text-emerald-600 font-medium`}>{stat.trend}</p>
                          </div>
                        ))}
                      </div>

                      {/* Chart Placeholder */}
                      <div className="bg-white rounded-xl p-4 shadow-sm flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-semibold text-slate-900 text-sm">Weekly Overview</p>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">Appointments</span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">Revenue</span>
                          </div>
                        </div>
                        <div className="flex items-end gap-2 h-24 lg:h-32">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 mb-8">Trusted by healthcare leaders worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-60">
            {partners.map((partner, i) => (
              <div key={i} className="text-slate-400 font-semibold text-lg">{partner}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center">
              <p className="text-5xl lg:text-6xl font-bold text-white mb-2">{stat1.count}+</p>
              <p className="text-blue-300 font-medium">Healthcare Providers</p>
            </div>
            <div className="text-center">
              <p className="text-5xl lg:text-6xl font-bold text-white mb-2">{stat2.count}M+</p>
              <p className="text-blue-300 font-medium">Patients Managed</p>
            </div>
            <div className="text-center">
              <p className="text-5xl lg:text-6xl font-bold text-white mb-2">{stat3.count}.9%</p>
              <p className="text-blue-300 font-medium">Uptime SLA</p>
            </div>
            <div className="text-center">
              <p className="text-5xl lg:text-6xl font-bold text-white mb-2">{stat4.count}%</p>
              <p className="text-blue-300 font-medium">Time Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to<br className="hidden lg:block" /> Run Your Hospital
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A complete suite of tools designed specifically for modern healthcare
              providers to streamline operations and enhance patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 lg:p-8 bg-white rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-emerald-500" />
              Customer Stories
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
              Loved by Healthcare Leaders
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See why leading hospitals and medical practices trust HealthCare Pro
              for their daily operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.hospital}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full text-violet-700 text-sm font-medium mb-4">
              <Award className="h-4 w-4" />
              Simple Pricing
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
              Plans for Every Healthcare Provider
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 lg:p-8 rounded-2xl border-2 transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-b from-blue-600 to-cyan-600 border-transparent shadow-xl shadow-blue-500/25 scale-105"
                    : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 text-sm font-semibold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? "text-blue-100" : "text-slate-600"}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl lg:text-5xl font-bold ${plan.popular ? "text-white" : "text-slate-900"}`}>
                    {plan.price === "Custom" ? "" : "$"}{plan.price}
                  </span>
                  {plan.period && (
                    <span className={plan.popular ? "text-blue-100" : "text-slate-600"}>/{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 mt-0.5 ${plan.popular ? "text-emerald-300" : "text-emerald-500"}`} />
                      <span className={plan.popular ? "text-blue-50" : "text-slate-600"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-28 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-700 text-sm font-medium mb-4">
              <Headphones className="h-4 w-4" />
              Support
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about HealthCare Pro.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <ChevronRight
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                      openFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi0yNHYtMmgxMnpNMzYgMjR2MkgyNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 500+ healthcare providers who trust HealthCare Pro. Start your free
            trial today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-500/30 text-white font-semibold rounded-full border border-white/30 hover:bg-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" />
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">HealthCare Pro</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Modern hospital management for the digital age.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">HIPAA</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2024 HealthCare Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
