import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-[#0D0F10]">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-between py-10 px-8 md:px-16 lg:px-24 max-w-2xl overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <Image
              src="/assets/icons/logo-icon.svg"
              alt="logo"
              width={38}
              height={38}
            />
            <span className="text-xl font-bold text-white">DoctorKhuji</span>
          </div>
          <RegisterForm />
        </div>
        <p className="text-xs text-[#76828D] mt-8">© 2026 DoctorKhuji. All rights reserved.</p>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block flex-1 relative">
        <Image
          src="/assets/images/register-img.png"
          alt="register"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0D0F10]/20" />
      </div>
    </div>
  );
}
