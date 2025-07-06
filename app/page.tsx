import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";

export default function Onboarding() {
  return (
    <div className="min-h-screen flex">
      <div className="flex w-full">
        {/* Left: Card */}
        <div className="flex-1 flex flex-col justify-between py-10 px-32">
          <div>
            <div className="flex items-center gap-2 mb-40">
              <Image
                src="/assets/icons/logo-icon.svg"
                alt="logo"
                width={40}
                height={40}
              />
              <span className="text-2xl font-bold">DoctorKhuji</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Hi there, ....</h2>
            <p className="text-[#ABB8C4] mb-8">
              Get Started with Appointments.
            </p>
            <PatientForm />
          </div>
          <div className="mt-8 text-xs text-gray-500">
            @doctorkhuji copyright
          </div>
        </div>
        {/* Right: Image */}
        <div className="flex-1 relative rounded-3xl overflow-hidden">
          <Image
            src="/assets/images/onboarding-img.png"
            alt="doctor"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </div>
  );
}
