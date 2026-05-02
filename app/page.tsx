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
  UserRound,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

type DoctorWithProfile = Prisma.UserGetPayload<{
  include: { doctorProfile: { select: { specialty: true; avgRating: true } } };
}>;

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

export default async function HomePage() {
  let doctors: DoctorWithProfile[] = [];
  try {
    doctors = await prisma.user.findMany({
      where: { role: "DOCTOR", doctorProfile: { isApproved: true } },
      include: { doctorProfile: { select: { specialty: true, avgRating: true } } },
      orderBy: { createdAt: "asc" },
      take: 4,
    });
  } catch {
    // DB unavailable (e.g. CI/build environment) — render empty state
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-app-bg/90 backdrop-blur-md border-b border-app-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer">
            <Image src="/assets/icons/logo-icon.svg" alt="DoctorKhuji home" width={34} height={34} />
            <span className="text-lg font-bold text-app-text">DoctorKhuji</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-app-muted">
            <a href="#features" className="hover:text-app-text transition-colors">Features</a>
            <a href="#doctors" className="hover:text-app-text transition-colors">Doctors</a>
            <a href="#how-it-works" className="hover:text-app-text transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle iconOnly />
            <Link href="/login" className="hidden md:block text-sm text-app-muted hover:text-app-text transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link
              href="/register"
              className="hidden md:block text-sm bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              Get Started
            </Link>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#24AE7C]/10 border border-[#24AE7C]/30 rounded-full px-4 py-2 text-sm text-[#24AE7C] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#24AE7C] animate-pulse" />
              Trusted by 10,000+ patients
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-app-text">
              Your Health,{" "}
              <span className="text-[#24AE7C]">Our Priority</span>
            </h1>
            <p className="text-app-muted text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              Connect with verified doctors, book appointments instantly, and
              manage your health records — all in one place.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap">
              <Link
                href="/register"
                className="flex items-center gap-2 bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl transition-colors shadow-lg shadow-[#24AE7C]/20 text-sm sm:text-base"
              >
                Book Appointment <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 border border-app-border-2 hover:border-[#24AE7C]/50 text-app-muted hover:text-app-text font-medium px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl transition-colors text-sm sm:text-base"
              >
                Sign In
              </Link>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 flex-wrap">
              {[
                { icon: ShieldCheck, text: "HIPAA Compliant" },
                { icon: CheckCircle, text: "Verified Doctors" },
                { icon: Star, text: "4.9/5 Rated" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs sm:text-sm text-app-subtle">
                  <Icon size={15} className="text-[#24AE7C]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-[#24AE7C]/5 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-app-border h-[520px] card-shadow">
              <Image
                src="/assets/images/onboarding-img.png"
                alt="Doctor"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-app-surface/90 backdrop-blur-md border border-app-border rounded-2xl p-4 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {doctors.slice(0, 3).map((d) => (
                    <div key={d.id} className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-app-surface bg-app-surface-2 flex items-center justify-center shrink-0">
                      {d.image
                        ? <Image src={d.image} alt={d.name ?? ""} fill className="object-cover" />
                        : <span className="text-[#24AE7C] text-xs font-bold">{d.name?.charAt(0)}</span>
                      }
                    </div>
                  ))}
                  {doctors.length === 0 && (
                    <div className="w-9 h-9 rounded-full bg-[#24AE7C]/20 flex items-center justify-center border-2 border-app-surface">
                      <Stethoscope size={14} className="text-[#24AE7C]" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-app-text">500+ Doctors Online</p>
                  <p className="text-xs text-app-subtle">Ready to consult right now</p>
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
      <section className="py-10 sm:py-14 border-y border-app-border bg-app-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-[#24AE7C]">{s.value}</p>
              <p className="text-xs sm:text-sm text-app-subtle mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14 space-y-3">
          <p className="text-sm text-[#24AE7C] font-semibold uppercase tracking-widest">Why DoctorKhuji</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-app-text">Everything you need for your health</h2>
          <p className="text-app-muted text-sm sm:text-base max-w-xl mx-auto">
            From booking to consultation, we make healthcare simple, accessible, and secure.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-app-surface border border-app-border rounded-2xl p-6 space-y-4 hover:border-[#24AE7C]/40 transition-all group card-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#24AE7C]/10 flex items-center justify-center group-hover:bg-[#24AE7C]/20 transition-colors">
                  <Icon size={22} className="text-[#24AE7C]" />
                </div>
                <h3 className="text-lg font-semibold text-app-text">{f.title}</h3>
                <p className="text-sm text-app-subtle leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-app-surface border-y border-app-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 space-y-3">
            <p className="text-sm text-[#24AE7C] font-semibold uppercase tracking-widest">Simple Process</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-app-text">How it works</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative flex flex-col gap-4">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-app-border" />
                )}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-[#24AE7C] flex items-center justify-center bg-[#24AE7C]/10 relative z-10">
                    <span className="text-[#24AE7C] font-bold text-sm">{s.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-app-text">{s.title}</h3>
                  <p className="text-app-subtle text-sm leading-relaxed max-w-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctors ── */}
      <section id="doctors" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14 space-y-3">
          <p className="text-sm text-[#24AE7C] font-semibold uppercase tracking-widest">Our Team</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-app-text">Meet our top doctors</h2>
          <p className="text-app-muted text-sm sm:text-base max-w-lg mx-auto">
            Experienced, verified, and ready to help you get the care you deserve.
          </p>
        </div>

        {doctors.length === 0 ? (
          <div className="bg-app-surface border border-app-border rounded-3xl p-16 text-center space-y-5 card-shadow">
            <div className="w-20 h-20 bg-[#24AE7C]/10 rounded-2xl flex items-center justify-center mx-auto">
              <Stethoscope size={36} className="text-[#24AE7C]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-app-text">Our Doctors Are Being Verified</h3>
              <p className="text-app-muted max-w-md mx-auto leading-relaxed">
                We maintain the highest standards by carefully verifying each doctor on our platform.
                Approved specialists will appear here shortly.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-app-subtle">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#24AE7C]" />
                Fully Verified
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#24AE7C]" />
                Background Checked
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#24AE7C]" />
                Top Rated
              </div>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-7 py-3 rounded-xl transition-colors mt-2"
            >
              <UserRound size={17} /> Register as a Doctor
            </Link>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-app-surface border border-app-border rounded-2xl overflow-hidden hover:border-[#24AE7C]/40 transition-all hover:-translate-y-1 group card-shadow"
                >
                  <div className="relative h-52 bg-app-surface-2">
                    {doc.image ? (
                      <>
                        <Image src={doc.image} alt={doc.name ?? "Doctor"} fill className="object-cover object-top" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-[#24AE7C]/10 flex items-center justify-center">
                          <span className="text-[#24AE7C] text-3xl font-bold">
                            {doc.name?.charAt(0).toUpperCase() ?? "D"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-semibold text-app-text">{doc.name}</h3>
                    <p className="text-sm text-app-subtle">{doc.doctorProfile?.specialty ?? "Specialist"}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                        <Star size={14} fill="currentColor" />
                        {doc.doctorProfile?.avgRating?.toFixed(1) ?? "New"}
                      </div>
                      <Link href="/register" className="text-xs text-[#24AE7C] hover:underline font-medium">
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
                className="inline-flex items-center gap-2 border border-app-border-2 hover:border-[#24AE7C]/50 text-app-muted hover:text-app-text font-medium px-8 py-3 rounded-xl transition-colors"
              >
                View all doctors <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-app-surface border-t border-app-border">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#24AE7C]/15 to-[#24AE7C]/5 border border-[#24AE7C]/20 rounded-3xl p-8 sm:p-12 text-center space-y-5 sm:space-y-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#24AE7C]/10 rounded-2xl flex items-center justify-center mx-auto border border-[#24AE7C]/20">
            <Stethoscope size={26} className="text-[#24AE7C]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-app-text">Ready to take control of your health?</h2>
          <p className="text-app-muted text-sm sm:text-base max-w-lg mx-auto">
            Join thousands of patients and doctors already using DoctorKhuji to simplify healthcare.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#24AE7C]/20"
            >
              <Users size={18} /> Join as Patient
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#24AE7C]/40 hover:border-[#24AE7C] hover:bg-[#24AE7C]/5 text-[#24AE7C] font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              <Stethoscope size={18} /> Join as Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-app-border py-8 sm:py-10 px-4 sm:px-6 bg-app-bg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
            <Image src="/assets/icons/logo-icon.svg" alt="DoctorKhuji home" width={28} height={28} />
            <span className="font-bold text-app-text">DoctorKhuji</span>
          </Link>
          <p className="text-sm text-app-subtle">© 2026 DoctorKhuji. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-app-subtle">
            <a href="#" className="hover:text-app-text transition-colors">Privacy</a>
            <a href="#" className="hover:text-app-text transition-colors">Terms</a>
            <Link href="/login" className="hover:text-app-text transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
