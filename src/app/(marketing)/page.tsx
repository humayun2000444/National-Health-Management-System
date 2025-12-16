import Link from "next/link";
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
} from "lucide-react";

const features = [
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Smart Scheduling",
    description:
      "Automated appointment booking with intelligent scheduling that reduces wait times and no-shows.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Digital Records",
    description:
      "Secure electronic medical records accessible anytime, anywhere with full patient history.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Patient Portal",
    description:
      "Empower patients with self-service booking, prescription refills, and health tracking.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics Dashboard",
    description:
      "Real-time insights into hospital performance, revenue, and patient satisfaction.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "HIPAA Compliant",
    description:
      "Enterprise-grade security with full HIPAA compliance and data encryption.",
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Multi-Department",
    description:
      "Manage multiple departments seamlessly with role-based access control.",
  },
];

const testimonials = [
  {
    quote:
      "This system has transformed how we manage our hospital. Patient wait times reduced by 40%.",
    author: "Dr. Sarah Wilson",
    role: "Chief Medical Officer",
    hospital: "City General Hospital",
  },
  {
    quote:
      "The best investment we've made. Our staff efficiency has increased dramatically.",
    author: "James Brown",
    role: "Hospital Administrator",
    hospital: "Metro Health Center",
  },
  {
    quote:
      "Finally, a system that doctors actually want to use. Intuitive and powerful.",
    author: "Dr. Michael Chen",
    role: "Department Head",
    hospital: "Central Medical",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "299",
    description: "Perfect for small clinics",
    features: [
      "Up to 5 doctors",
      "Basic appointment scheduling",
      "Patient management",
      "Email support",
      "Basic analytics",
    ],
  },
  {
    name: "Professional",
    price: "599",
    description: "For growing hospitals",
    features: [
      "Up to 25 doctors",
      "Advanced scheduling",
      "Digital prescriptions",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large healthcare networks",
    features: [
      "Unlimited doctors",
      "Multi-location support",
      "Custom integrations",
      "24/7 dedicated support",
      "On-premise option",
      "SLA guarantee",
      "Training included",
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">
                HealthCare Pro
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                Testimonials
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Trusted by 500+ Healthcare Providers
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Modern Hospital Management for the{" "}
              <span className="text-blue-600">Digital Age</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Streamline operations, enhance patient care, and grow your
              healthcare business with our comprehensive hospital management
              platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-900 font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-900 rounded-2xl p-2 shadow-2xl">
              <div className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="bg-slate-100 rounded-lg aspect-[16/9] flex items-center justify-center">
                  <div className="text-center">
                    <Stethoscope className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">
                      Professional Dashboard Interface
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">500+</p>
              <p className="text-slate-600 mt-1">Healthcare Providers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">2M+</p>
              <p className="text-slate-600 mt-1">Patients Managed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">99.9%</p>
              <p className="text-slate-600 mt-1">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">40%</p>
              <p className="text-slate-600 mt-1">Time Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Run Your Hospital
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A complete suite of tools designed specifically for healthcare
              providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`p-8 bg-white rounded-2xl border-2 ${
                  plan.popular
                    ? "border-blue-600 shadow-xl relative"
                    : "border-slate-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">
                    {plan.price === "Custom" ? "" : "$"}
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-slate-600">/month</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-slate-50 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-slate-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-slate-600">
                    {testimonial.role}, {testimonial.hospital}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Hospital?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 500+ healthcare providers who trust HealthCare Pro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <a
              href="#"
              className="w-full sm:w-auto px-8 py-4 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-400 transition-colors"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-white">
                HealthCare Pro
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2024 HealthCare Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
