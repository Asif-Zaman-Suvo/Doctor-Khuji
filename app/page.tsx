import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Users,
  CheckCircle,
} from "lucide-react";

const doctors = [
  { name: "Dr. Cameron", img: "/assets/images/dr-cameron.png", specialty: "Cardiologist", rating: 4.9 },
  { name: "Dr. Cruz", img: "/assets/images/dr-cruz.png", specialty: "Pediatrician", rating: 4.8 },
  { name: "Dr. Green", img: "/assets/images/dr-green.png", specialty: "Orthopedic", rating: 4.7 },
  { name: "Dr. Lee", img: "/assets/images/dr-lee.png", specialty: "Neurologist", rating: 4.9 },
];

const features = [
  {
    icon: CalendarDays,
    title: "Easy Scheduling",
    desc: "Book appointments with top doctors in just a few clicks — anytime, anywhere.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Doctors",
    desc: "Every doctor on our platform is thoroughly verified and credentialed.",
  },
  {
    icon: HeartPulse,
    title: "Health Records",
    desc: "Keep all your medical history and records secure in one place.",
  },
  {
    icon: Clock,
    title: "24/7 Access",
    desc: "Manage your health round the clock — no waiting rooms, no hassle.",
  },
];

const stats = [
  { value: "10K+", label: "Patients Served" },
  { value: "500+", label: "Verified Doctors" },
  { value: "50+", label: "Specialties" },
  { value: "4.9★", label: "Average Rating" },
];

const steps = [
  { step: "01", title: "Create Account", desc: "Sign up as a patient or doctor in under a minute." },
  { step: "02", title: "Find a Doctor", desc: "Browse verified specialists by specialty or availability." },
  { step: "03", title: "Book & Consult", desc: "Schedule your appointment and get the care you need." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0D0F10] text-white">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0D0F10]/80 backdrop-blur-md border-b border-[#1E2124]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/assets/icons/logo-icon.svg" alt="logo" width={34} height={34} />
            <span className="text-lg font-bold">DoctorKhuji</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#ABB8C4]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#doctors" className="hover:text-white transition-colors">Doctors</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[#ABB8C4] hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#24AE7C]/10 border border-[#24AE7C]/30 rounded-full px-4 py-2 text-sm text-[#24AE7C] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#24AE7C] animate-pulse" />
              Trusted by 10,000+ patients
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Your Health,{" "}
              <span className="text-[#24AE7C]">Our Priority</span>
            </h1>
            <p className="text-[#ABB8C4] text-lg leading-relaxed max-w-lg">
              Connect with verified doctors, book appointments instantly, and
              manage your health records — all in one place.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                Book Appointment <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 border border-[#363A3D] hover:border-[#24AE7C]/50 text-[#ABB8C4] hover:text-white font-medium px-7 py-3.5 rounded-xl transition-colors"
              >
                Sign In
              </Link>
            </div>
            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-2">
              {[
                { icon: ShieldCheck, text: "HIPAA Compliant" },
                { icon: CheckCircle, text: "Verified Doctors" },
                { icon: Star, text: "4.9/5 Rated" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-[#76828D]">
                  <Icon size={15} className="text-[#24AE7C]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-[#24AE7C]/5 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-[#1E2124] h-[520px]">
              <Image
                src="/assets/images/onboarding-img.png"
                alt="Doctor"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F10]/60 to-transparent" />

              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0D0F10]/80 backdrop-blur-md border border-[#1E2124] rounded-2xl p-4 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {doctors.slice(0, 3).map((d) => (
                    <div key={d.name} className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#0D0F10]">
                      <Image src={d.img} alt={d.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">500+ Doctors Online</p>
                  <p className="text-xs text-[#76828D]">Ready to consult right now</p>
                </div>
                <div className="ml-auto flex items-center gap-1 bg-[#24AE7C]/10 border border-[#24AE7C]/30 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 bg-[#24AE7C] rounded-full animate-pulse" />
                  <span className="text-xs text-[#24AE7C] font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 border-y border-[#1E2124] bg-[#0D0F10]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-[#24AE7C]">{s.value}</p>
              <p className="text-sm text-[#76828D] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <p className="text-sm text-[#24AE7C] font-semibold uppercase tracking-widest">Why DoctorKhuji</p>
          <h2 className="text-4xl font-bold">Everything you need for your health</h2>
          <p className="text-[#ABB8C4] max-w-xl mx-auto">
            From booking to consultation, we make healthcare simple, accessible, and secure.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-6 space-y-4 hover:border-[#24AE7C]/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#24AE7C]/10 flex items-center justify-center group-hover:bg-[#24AE7C]/20 transition-colors">
                  <Icon size={22} className="text-[#24AE7C]" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-[#76828D] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0A0C0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-sm text-[#24AE7C] font-semibold uppercase tracking-widest">Simple Process</p>
            <h2 className="text-4xl font-bold">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative flex flex-col gap-4">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-[#1E2124]" />
                )}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-[#24AE7C] flex items-center justify-center bg-[#24AE7C]/10 relative z-10">
                    <span className="text-[#24AE7C] font-bold text-sm">{s.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{s.title}</h3>
                  <p className="text-[#76828D] text-sm leading-relaxed max-w-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctors ── */}
      <section id="doctors" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <p className="text-sm text-[#24AE7C] font-semibold uppercase tracking-widest">Our Team</p>
          <h2 className="text-4xl font-bold">Meet our top doctors</h2>
          <p className="text-[#ABB8C4] max-w-lg mx-auto">
            Experienced, verified, and ready to help you get the care you deserve.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.name}
              className="bg-[#161A1F] border border-[#1E2124] rounded-2xl overflow-hidden hover:border-[#24AE7C]/30 transition-all hover:-translate-y-1 group"
            >
              <div className="relative h-52">
                <Image src={doc.img} alt={doc.name} fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161A1F] to-transparent" />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-semibold text-white">{doc.name}</h3>
                <p className="text-sm text-[#76828D]">{doc.specialty}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                    <Star size={14} fill="currentColor" />
                    {doc.rating}
                  </div>
                  <Link
                    href="/register"
                    className="text-xs text-[#24AE7C] hover:underline font-medium"
                  >
                    Book →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 border border-[#363A3D] hover:border-[#24AE7C]/50 text-[#ABB8C4] hover:text-white font-medium px-8 py-3 rounded-xl transition-colors"
          >
            View all doctors <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#24AE7C]/20 to-[#1d9268]/5 border border-[#24AE7C]/20 rounded-3xl p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-[#24AE7C]/10 rounded-full flex items-center justify-center mx-auto">
            <Stethoscope size={28} className="text-[#24AE7C]" />
          </div>
          <h2 className="text-4xl font-bold">Ready to take control of your health?</h2>
          <p className="text-[#ABB8C4] max-w-lg mx-auto">
            Join thousands of patients and doctors already using DoctorKhuji to simplify healthcare.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              <Users size={18} /> Join as Patient
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 border border-[#24AE7C]/40 hover:border-[#24AE7C] text-[#24AE7C] font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              <Stethoscope size={18} /> Join as Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1E2124] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/assets/icons/logo-icon.svg" alt="logo" width={28} height={28} />
            <span className="font-bold text-white">DoctorKhuji</span>
          </div>
          <p className="text-sm text-[#76828D]">© 2026 DoctorKhuji. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-[#76828D]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
