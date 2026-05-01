import LoginForm from "@/components/forms/LoginForm";
import Image from "next/image";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-app-bg">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-between py-10 px-8 md:px-16 lg:px-24 max-w-2xl bg-app-surface card-shadow">
        <div>
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <Image src="/assets/icons/logo-icon.svg" alt="logo" width={38} height={38} />
              <span className="text-xl font-bold text-app-text">DoctorKhuji</span>
            </div>
            <ThemeToggle iconOnly />
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-xs text-app-subtle">© 2026 DoctorKhuji. All rights reserved.</p>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:flex flex-1 relative flex-col overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200&q=80"
          alt="Doctor consulting patient"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end h-full p-12 pb-16 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#24AE7C]">Welcome Back</p>
          <h2 className="text-3xl font-bold text-white leading-snug max-w-xs">
            Trusted care, at your fingertips
          </h2>
          <p className="text-white/70 text-sm max-w-xs leading-relaxed">
            Sign in to view your appointments, health records, and connect with your doctors.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm" />
              ))}
            </div>
            <p className="text-white/60 text-xs">10,000+ patients trust us</p>
          </div>
        </div>
      </div>
    </div>
  );
}
