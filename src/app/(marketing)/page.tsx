"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Heart,
  Shield,
  Users,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  Stethoscope,
  Baby,
  Brain,
  Bone,
  Eye,
  Activity,
  Ambulance,
  Award,
  CheckCircle2,
  Menu,
  X,
  ArrowRight,
  Building2,
  UserCheck,
  HeartPulse,
  Microscope,
  Scan,
  BadgeCheck,
  Quote,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Droplets,
  Apple,
  Dumbbell,
  Pill,
  CreditCard,
  Wallet,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Bed,
  Syringe,
  FlaskConical,
  Car,
  Wifi,
  Utensils,
  Leaf,
  ThermometerSun,
  HeartHandshake,
  ClipboardList,
  FileText,
  AlertCircle,
} from "lucide-react";

// Hospital departments/services with patient-friendly descriptions
const services = [
  {
    icon: <HeartPulse className="h-7 w-7" />,
    name: "Heart Care",
    description: "Expert cardiac care including heart checkups, ECG, Echo, and advanced treatments for heart conditions.",
    features: ["ECG & Echo", "Angiography", "Cardiac Rehab"],
    color: "bg-rose-50 text-rose-600 border-rose-100",
    iconBg: "bg-rose-100",
  },
  {
    icon: <Brain className="h-7 w-7" />,
    name: "Brain & Nerve Care",
    description: "Specialized treatment for headaches, stroke, epilepsy, and nervous system disorders.",
    features: ["EEG Testing", "Stroke Care", "Memory Clinic"],
    color: "bg-violet-50 text-violet-600 border-violet-100",
    iconBg: "bg-violet-100",
  },
  {
    icon: <Bone className="h-7 w-7" />,
    name: "Bone & Joint Care",
    description: "Treatment for joint pain, arthritis, fractures, and spine problems with physiotherapy support.",
    features: ["Joint Replacement", "Spine Treatment", "Physiotherapy"],
    color: "bg-amber-50 text-amber-600 border-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    icon: <Baby className="h-7 w-7" />,
    name: "Child Health",
    description: "Complete healthcare for babies, children, and teenagers with vaccinations and growth monitoring.",
    features: ["Vaccinations", "Growth Checkup", "Child Nutrition"],
    color: "bg-pink-50 text-pink-600 border-pink-100",
    iconBg: "bg-pink-100",
  },
  {
    icon: <Stethoscope className="h-7 w-7" />,
    name: "Family Medicine",
    description: "General health checkups, fever, cold, diabetes, blood pressure, and routine health issues.",
    features: ["Health Checkup", "Diabetes Care", "BP Management"],
    color: "bg-teal-50 text-teal-600 border-teal-100",
    iconBg: "bg-teal-100",
  },
  {
    icon: <Eye className="h-7 w-7" />,
    name: "Eye Care",
    description: "Complete eye examinations, glasses prescription, cataract surgery, and vision treatments.",
    features: ["Eye Testing", "Cataract Surgery", "LASIK"],
    color: "bg-sky-50 text-sky-600 border-sky-100",
    iconBg: "bg-sky-100",
  },
  {
    icon: <Microscope className="h-7 w-7" />,
    name: "Lab & Diagnostics",
    description: "Blood tests, urine tests, and all diagnostic tests with quick and accurate results.",
    features: ["Blood Tests", "Urine Analysis", "Same-Day Results"],
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    iconBg: "bg-indigo-100",
  },
  {
    icon: <Scan className="h-7 w-7" />,
    name: "X-Ray & Imaging",
    description: "X-Ray, Ultrasound, CT Scan, and MRI services with expert radiologist reports.",
    features: ["X-Ray", "CT Scan", "MRI & Ultrasound"],
    color: "bg-slate-50 text-slate-600 border-slate-100",
    iconBg: "bg-slate-100",
  },
];

// Health tips for patients
const healthTips = [
  {
    icon: <Droplets className="h-6 w-6" />,
    title: "Stay Hydrated",
    tip: "Drink 8-10 glasses of water daily. Keep a water bottle with you always.",
    color: "bg-sky-100 text-sky-600",
  },
  {
    icon: <Sun className="h-6 w-6" />,
    title: "Morning Sunlight",
    tip: "Get 15-20 minutes of morning sunlight for Vitamin D and better mood.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: <Apple className="h-6 w-6" />,
    title: "Eat Fresh Vegetables",
    tip: "Include colorful vegetables in every meal for essential nutrients.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <Moon className="h-6 w-6" />,
    title: "Sleep 7-8 Hours",
    tip: "Maintain regular sleep schedule. Avoid screens 1 hour before bed.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: <Dumbbell className="h-6 w-6" />,
    title: "Stay Active",
    tip: "Walk 30 minutes daily. Take stairs instead of elevator when possible.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Regular Checkups",
    tip: "Get annual health checkup. Early detection prevents serious illness.",
    color: "bg-teal-100 text-teal-600",
  },
];

// Health packages
const healthPackages = [
  {
    name: "Basic Health Checkup",
    price: "1,500",
    popular: false,
    description: "Essential tests for general health assessment",
    tests: [
      "Complete Blood Count (CBC)",
      "Blood Sugar (Fasting)",
      "Urine Routine",
      "Blood Pressure Check",
      "BMI Calculation",
      "Doctor Consultation",
    ],
    color: "border-teal-200 bg-teal-50/30",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
  },
  {
    name: "Comprehensive Checkup",
    price: "3,500",
    popular: true,
    description: "Complete body checkup for thorough health evaluation",
    tests: [
      "All Basic Package Tests",
      "Lipid Profile (Cholesterol)",
      "Liver Function Test",
      "Kidney Function Test",
      "Thyroid Profile",
      "Chest X-Ray",
      "ECG",
      "Specialist Consultation",
    ],
    color: "border-emerald-300 bg-emerald-50/50",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    name: "Executive Health Package",
    price: "7,500",
    popular: false,
    description: "Premium checkup with advanced diagnostics",
    tests: [
      "All Comprehensive Tests",
      "Cardiac Stress Test",
      "Ultrasound Abdomen",
      "Vitamin D & B12",
      "Cancer Markers (Basic)",
      "Eye Checkup",
      "Dental Checkup",
      "Diet Consultation",
    ],
    color: "border-violet-200 bg-violet-50/30",
    buttonColor: "bg-violet-600 hover:bg-violet-700",
  },
];

// Hospital facilities
const facilities = [
  { icon: <Bed className="h-5 w-5" />, name: "200+ Beds", description: "Comfortable patient rooms" },
  { icon: <Ambulance className="h-5 w-5" />, name: "Ambulance", description: "24/7 emergency pickup" },
  { icon: <FlaskConical className="h-5 w-5" />, name: "Modern Lab", description: "Same-day test results" },
  { icon: <Syringe className="h-5 w-5" />, name: "Pharmacy", description: "In-house medicine store" },
  { icon: <Car className="h-5 w-5" />, name: "Free Parking", description: "Spacious parking area" },
  { icon: <Wifi className="h-5 w-5" />, name: "Free WiFi", description: "Throughout hospital" },
  { icon: <Utensils className="h-5 w-5" />, name: "Cafeteria", description: "Healthy food options" },
  { icon: <Leaf className="h-5 w-5" />, name: "Garden Area", description: "Peaceful recovery space" },
];

// Insurance partners
const insurancePartners = [
  "MetLife", "Prudential", "Green Delta", "Pragati Life", "Prime Insurance", "Guardian Life"
];

// FAQ items
const faqItems = [
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment through our Patient Portal online, by calling our helpline at +880 1234-567890, or by visiting our reception desk. Online booking is available 24/7 through the Patient Portal."
  },
  {
    question: "What are your visiting hours?",
    answer: "General visiting hours are 11:00 AM - 1:00 PM and 5:00 PM - 7:00 PM daily. ICU visiting is limited to 15 minutes, twice daily. Please check with the nursing station for specific ward timings."
  },
  {
    question: "Do you accept insurance?",
    answer: "Yes, we accept most major insurance providers including MetLife, Prudential, Green Delta, Pragati Life, and many others. Please bring your insurance card and ID when visiting. Our billing team can help verify your coverage."
  },
  {
    question: "How can I get my test results?",
    answer: "Test results are available through our Patient Portal within 24-48 hours. You can also collect printed reports from our lab counter. Urgent test results are communicated directly by your doctor."
  },
  {
    question: "Is emergency service available 24/7?",
    answer: "Yes, our Emergency Department operates 24 hours a day, 7 days a week, including all holidays. For medical emergencies, call our emergency hotline at +880 1234-999999 or come directly to our Emergency entrance."
  },
  {
    question: "What should I bring for admission?",
    answer: "Please bring: valid ID, insurance card (if applicable), list of current medications, previous medical records, comfortable clothes, and basic toiletries. A family member should be available for paperwork."
  },
];

// Patient testimonials
const testimonials = [
  {
    name: "Rahim Ahmed",
    age: 58,
    treatment: "Heart Surgery",
    quote: "I was scared about my heart surgery, but the doctors explained everything patiently. The surgery was successful and the nursing care was excellent. I'm grateful to the entire team.",
    rating: 5,
    date: "2 months ago",
  },
  {
    name: "Fatima Begum",
    age: 45,
    treatment: "Knee Replacement",
    quote: "After years of knee pain, I can finally walk without discomfort. The physiotherapy team helped me recover faster than expected. The hospital feels like family.",
    rating: 5,
    date: "3 months ago",
  },
  {
    name: "Kamal Hassan",
    age: 35,
    treatment: "Health Checkup",
    quote: "The health checkup package was very thorough and affordable. They detected early signs of diabetes which helped me take preventive action. Highly recommend their checkup packages.",
    rating: 5,
    date: "1 month ago",
  },
];

// Stats
const stats = [
  { value: "50+", label: "Expert Doctors", icon: <UserCheck className="h-6 w-6" /> },
  { value: "10,000+", label: "Happy Patients", icon: <Heart className="h-6 w-6" /> },
  { value: "15+", label: "Departments", icon: <Building2 className="h-6 w-6" /> },
  { value: "28+", label: "Years of Service", icon: <Award className="h-6 w-6" /> },
];

// Hospital info type
interface HospitalInfo {
  name: string;
  logo: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  showHospitalName: boolean;
  showTagline: boolean;
  tagline: string;
}

export default function HospitalLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);

  useEffect(() => {
    // Fetch hospital info including logo
    fetch("/api/public/hospital")
      .then((res) => res.json())
      .then((data) => setHospitalInfo(data))
      .catch((err) => console.error("Failed to fetch hospital info:", err));
  }, []);

  // Use hospital name from settings or default
  const hospitalName = hospitalInfo?.name || "City General Hospital";
  const hospitalLogo = hospitalInfo?.logo;
  const hospitalPhone = hospitalInfo?.phone || "+880 1234-567890";
  const hospitalEmail = hospitalInfo?.email || "info@cityhospital.com";
  const hospitalAddress = hospitalInfo?.address || "123 Healthcare Avenue, Dhanmondi, Dhaka 1205";
  const showHospitalName = hospitalInfo?.showHospitalName ?? true;
  const showTagline = hospitalInfo?.showTagline ?? true;
  const tagline = hospitalInfo?.tagline || "Caring for You & Your Family";

  // Branding colors
  const primaryColor = hospitalInfo?.primaryColor || "#0d9488";
  const secondaryColor = hospitalInfo?.secondaryColor || "#059669";
  const accentColor = hospitalInfo?.accentColor || "#f59e0b";

  // Gradient styles using dynamic colors
  const gradientStyle = { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` };
  const gradientBrStyle = { background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              {hospitalLogo ? (
                <div className={`rounded-xl overflow-hidden shadow-lg border ${showHospitalName ? 'w-16 h-9' : 'w-24 h-[54px]'}`} style={{ boxShadow: `0 10px 25px -5px ${primaryColor}30`, borderColor: `${primaryColor}20` }}>
                  <Image
                    src={hospitalLogo}
                    alt={hospitalName}
                    width={96}
                    height={54}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="p-2.5 rounded-xl shadow-lg" style={{ ...gradientBrStyle, boxShadow: `0 10px 25px -5px ${primaryColor}30` }}>
                  <HeartHandshake className="h-6 w-6 text-white" />
                </div>
              )}
              {showHospitalName && (
                <div>
                  <span className="text-xl font-bold text-slate-800">{hospitalName}</span>
                  {showTagline && (
                    <span className="hidden sm:block text-xs font-medium" style={{ color: primaryColor }}>{tagline}</span>
                  )}
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-teal-600 text-sm font-medium transition-colors">
                Services
              </a>
              <a href="#packages" className="text-slate-600 hover:text-teal-600 text-sm font-medium transition-colors">
                Health Packages
              </a>
              <a href="#facilities" className="text-slate-600 hover:text-teal-600 text-sm font-medium transition-colors">
                Facilities
              </a>
              <a href="#faq" className="text-slate-600 hover:text-teal-600 text-sm font-medium transition-colors">
                FAQ
              </a>
              <a href="#contact" className="text-slate-600 hover:text-teal-600 text-sm font-medium transition-colors">
                Contact
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a href={`tel:${hospitalPhone?.replace(/\s/g, "")}`} className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">{hospitalPhone}</span>
              </a>
              <Link
                href="/login"
                className="px-5 py-2.5 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all"
                style={{ ...gradientStyle, boxShadow: `0 4px 14px ${primaryColor}40` }}
              >
                Patient Portal
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-teal-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-teal-100 px-4 py-6 space-y-4">
            <a href="#services" className="block text-slate-600 hover:text-teal-600 font-medium">Services</a>
            <a href="#packages" className="block text-slate-600 hover:text-teal-600 font-medium">Health Packages</a>
            <a href="#facilities" className="block text-slate-600 hover:text-teal-600 font-medium">Facilities</a>
            <a href="#faq" className="block text-slate-600 hover:text-teal-600 font-medium">FAQ</a>
            <a href="#contact" className="block text-slate-600 hover:text-teal-600 font-medium">Contact</a>
            <div className="pt-4 border-t border-teal-100 space-y-3">
              <a href={`tel:${hospitalPhone?.replace(/\s/g, "")}`} className="flex items-center gap-2 font-medium" style={{ color: primaryColor }}>
                <Phone className="h-4 w-4" />
                {hospitalPhone}
              </a>
              <Link href="/login" className="block text-center py-2.5 text-white font-medium rounded-full" style={gradientStyle}>
                Patient Portal
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Warm & Welcoming */}
      <section className="relative pt-20 overflow-hidden">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50" />

        {/* Soft decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 right-10 w-72 h-72 bg-teal-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-teal-700 text-sm font-medium mb-6 shadow-sm border border-teal-100">
                <HeartHandshake className="h-4 w-4" />
                Caring for Bangladesh Since 1995
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
                Your Family's Health,{" "}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                  Our Promise
                </span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We understand healthcare can be stressful. That's why we focus on making your
                experience comfortable and caring. From routine checkups to specialized treatments,
                our experienced doctors are here for you and your loved ones.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/login"
                  className="px-8 py-4 text-white font-semibold rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  style={{ ...gradientStyle, boxShadow: `0 10px 25px -5px ${primaryColor}40` }}
                >
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
                <a
                  href="tel:+8801234999999"
                  className="px-8 py-4 bg-rose-50 text-rose-700 font-semibold rounded-2xl border-2 border-rose-200 hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                >
                  <Ambulance className="h-5 w-5" />
                  Emergency: 999999
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-teal-100">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 font-medium">4.9 Patient Rating</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-teal-600" />
                  <span className="text-sm text-slate-600 font-medium">DGHS Accredited</span>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-teal-100">
                {/* Emergency Card */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl border border-rose-100 mb-4">
                  <div className="p-3 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl shadow-lg shadow-rose-500/30">
                    <Ambulance className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">24/7 Emergency Service</p>
                    <p className="text-rose-600 font-bold text-lg">+880 1234-999999</p>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-4 bg-teal-50 rounded-xl text-center border border-teal-100">
                    <Clock className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">OPD Hours</p>
                    <p className="text-sm font-semibold text-slate-700">8 AM - 8 PM</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                    <MapPin className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm font-semibold text-slate-700">Dhaka 1205</p>
                  </div>
                </div>

                {/* Today's Availability */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ThermometerSun className="h-5 w-5 text-amber-600" />
                    <p className="font-semibold text-slate-800">Today's Availability</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-600 border border-amber-200">General Medicine</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-600 border border-amber-200">Child Health</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-600 border border-amber-200">Heart Care</span>
                  </div>
                </div>

                {/* Online Services */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700 mb-2">Available Online:</p>
                  {["Book Appointments 24/7", "View Lab Results", "Download Prescriptions"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-amber-100">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">28+ Years</p>
                  <p className="text-xs text-slate-500">Trusted Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Soft Colors */}
      <section className="py-12" style={gradientStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3">
                  <div className="text-white">{stat.icon}</div>
                </div>
                <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-teal-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Daily Health Tips
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-3">
              Simple Tips for Better Health
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Small daily habits can make a big difference in your health. Here are some easy tips to follow.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {healthTips.map((tip, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className={`w-12 h-12 ${tip.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  {tip.icon}
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{tip.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full text-teal-700 text-sm font-medium mb-4">
              <Stethoscope className="h-4 w-4" />
              Our Services
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-3">
              Complete Healthcare Under One Roof
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From routine checkups to specialized treatments, we have expert doctors for all your health needs.
              Each department is equipped with modern facilities for accurate diagnosis and effective treatment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <div
                key={i}
                className={`group p-5 bg-white rounded-2xl border ${service.color} hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-14 h-14 ${service.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <div className={service.color.split(' ')[1]}>{service.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{service.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">{service.description}</p>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, j) => (
                    <span key={j} className="px-2 py-1 bg-slate-50 rounded text-xs text-slate-500">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Packages Section */}
      <section id="packages" className="py-16 lg:py-20 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">
              <ClipboardList className="h-4 w-4" />
              Health Checkup Packages
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-3">
              Affordable Health Packages
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Regular health checkups help detect problems early. Choose a package that fits your needs.
              All packages include doctor consultation and detailed reports.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {healthPackages.map((pkg, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-2xl p-6 border-2 ${pkg.color} ${pkg.popular ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6 pt-2">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{pkg.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{pkg.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-slate-800">{pkg.price}</span>
                    <span className="text-slate-500">BDT</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.tests.map((test, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {test}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block w-full py-3 ${pkg.buttonColor} text-white font-medium rounded-xl text-center transition-colors`}
                >
                  Book This Package
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            * Prices are in BDT. Additional tests can be added at extra cost. Valid for all ages.
          </p>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 rounded-full text-sky-700 text-sm font-medium mb-4">
              <Building2 className="h-4 w-4" />
              Our Facilities
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-3">
              Modern Facilities for Your Comfort
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We've designed our hospital to make your visit as comfortable as possible.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {facilities.map((facility, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-2 text-sky-600">
                  {facility.icon}
                </div>
                <p className="font-semibold text-slate-800 text-sm">{facility.name}</p>
                <p className="text-xs text-slate-500">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="py-12 bg-gradient-to-r from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <CreditCard className="h-5 w-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-slate-800">Insurance & Payment</h3>
              </div>
              <p className="text-slate-600 text-sm">
                We accept most major insurance providers. Cash, card, and mobile payments also accepted.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {insurancePartners.map((partner, i) => (
                <div key={i} className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 rounded-full text-rose-700 text-sm font-medium mb-4">
              <Heart className="h-4 w-4" />
              Patient Stories
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-3">
              What Our Patients Say
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Real experiences from real patients who trusted us with their health.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-5 leading-relaxed text-sm">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={gradientBrStyle}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{testimonial.name}, {testimonial.age}</p>
                    <p className="text-xs" style={{ color: primaryColor }}>{testimonial.treatment} • {testimonial.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-4">
              <HelpCircle className="h-4 w-4" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-3">
              Have Questions?
            </h2>
            <p className="text-slate-600">
              Find answers to common questions about our services, visiting hours, and more.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-800">{item.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-slate-600 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-teal-50 rounded-xl border border-teal-100 text-center">
            <p className="text-slate-700 mb-2">Still have questions?</p>
            <a href="tel:+8801234567890" className="inline-flex items-center gap-2 text-teal-700 font-semibold">
              <Phone className="h-4 w-4" />
              Call us at +880 1234-567890
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={gradientBrStyle}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
            Your Health Can't Wait
          </h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Don't delay your health checkup. Book an appointment today or visit our hospital.
            Our caring team is ready to help you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white font-semibold rounded-2xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
              style={{ color: primaryColor }}
            >
              <Calendar className="h-5 w-5" />
              Book Appointment Online
            </Link>
            <a
              href="tel:+8801234999999"
              className="w-full sm:w-auto px-8 py-4 bg-rose-500 text-white font-semibold rounded-2xl hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
            >
              <Ambulance className="h-5 w-5" />
              Emergency: 999999
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-3">
              Visit Us Today
            </h2>
            <p className="text-slate-600">
              We're conveniently located and easy to reach. Come visit us for your healthcare needs.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl text-center border border-slate-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Address</h3>
              <p className="text-slate-600 text-sm">
                123 Healthcare Avenue<br />
                Dhanmondi, Dhaka 1205
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
              <p className="text-slate-600 text-sm">
                Helpline: +880 1234-567890<br />
                <span className="text-rose-600 font-medium">Emergency: +880 1234-999999</span>
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center border border-slate-100">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">OPD Hours</h3>
              <p className="text-slate-600 text-sm">
                Sat - Thu: 8 AM - 8 PM<br />
                Friday: 9 AM - 5 PM
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
              <p className="text-slate-600 text-sm">
                info@cityhospital.com<br />
                appointments@cityhospital.com
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-8 p-5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-4 max-w-3xl mx-auto">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Visiting Hours Reminder</p>
              <p className="text-amber-700 text-sm">
                General Ward: 11 AM - 1 PM & 5 PM - 7 PM daily. ICU: 15 minutes, twice daily (12 PM & 6 PM).
                Please follow infection control guidelines and wear masks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                {hospitalLogo ? (
                  <div className={`rounded-xl overflow-hidden border border-slate-600 ${showHospitalName ? 'w-14 h-8' : 'w-20 h-[45px]'}`}>
                    <Image
                      src={hospitalLogo}
                      alt={hospitalName}
                      width={80}
                      height={45}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-2 rounded-xl" style={gradientBrStyle}>
                    <HeartHandshake className="h-5 w-5 text-white" />
                  </div>
                )}
                {showHospitalName && (
                  <span className="text-lg font-bold text-white">{hospitalName}</span>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Providing quality healthcare with compassion since 1995. Your health is our priority.
              </p>
              <div className="flex items-center gap-2 text-rose-400">
                <Ambulance className="h-4 w-4" />
                <span className="font-semibold">Emergency: 999999</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="text-slate-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#packages" className="text-slate-400 hover:text-white transition-colors">Health Packages</a></li>
                <li><a href="#facilities" className="text-slate-400 hover:text-white transition-colors">Facilities</a></li>
                <li><Link href="/login" className="text-slate-400 hover:text-white transition-colors">Patient Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Departments</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-slate-400">Heart Care</span></li>
                <li><span className="text-slate-400">Child Health</span></li>
                <li><span className="text-slate-400">Bone & Joint</span></li>
                <li><span className="text-slate-400">Eye Care</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-4 w-4" />
                  {hospitalPhone}
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                  {hospitalEmail}
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  {hospitalAddress?.split(",").slice(-2).join(",").trim() || "Dhaka, Bangladesh"}
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} {hospitalName}. All rights reserved.
            </p>
            <p className="text-slate-500 text-sm">
              Powered by <span style={{ color: primaryColor }}>NHMS</span> - National Health Management System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
