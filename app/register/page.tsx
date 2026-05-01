import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-app-bg">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-between py-10 px-8 md:px-16 lg:px-24 max-w-2xl overflow-y-auto bg-app-surface card-shadow">
        <div>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <Image src="/assets/icons/logo-icon.svg" alt="logo" width={38} height={38} />
              <span className="text-xl font-bold text-app-text">DoctorKhuji</span>
            </div>
            <ThemeToggle iconOnly />
          </div>
          <RegisterForm />
        </div>
        <p className="text-xs text-app-subtle mt-8">© 2026 DoctorKhuji. All rights reserved.</p>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:flex flex-1 relative flex-col overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=80"
          alt="Modern hospital interior"
          fill
          className="object-cover object-center"
          priority
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        {/* text overlay */}
        <div className="relative z-10 flex flex-col justify-end h-full p-12 pb-16 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#24AE7C]">DoctorKhuji Platform</p>
          <h2 className="text-3xl font-bold text-white leading-snug max-w-xs">
            Your health journey starts here
          </h2>
          <p className="text-white/70 text-sm max-w-xs leading-relaxed">
            Connect with top verified specialists and manage your care — all in one place.
          </p>
          <div className="flex gap-4 pt-2">
            {["Verified Doctors", "Instant Booking", "Health Records"].map((t) => (
              <span key={t} className="text-xs bg-white/10 border border-white/20 text-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
