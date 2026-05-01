"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bookAppointment } from "@/app/actions/patient";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import Image from "next/image";

interface Doctor {
  id: string;
  name: string | null;
  image: string | null;
  doctorProfile: {
    specialty: string | null;
    consultationFee: number | null;
    availableDays: string[];
  } | null;
}

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

export default function BookAppointmentForm({ doctors, preselectedId }: { doctors: Doctor[]; preselectedId?: string }) {
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedId ?? "");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doctor = doctors.find(d => d.id === selectedDoctor);
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDoctor || !date || !timeSlot) {
      setError("Please select a doctor, date, and time slot.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await bookAppointment({ doctorId: selectedDoctor, date, timeSlot, reason });
    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }
    router.push("/dashboard/patient/appointments");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Doctor Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[#ABB8C4]">Select Doctor</label>
        <div className="grid sm:grid-cols-2 gap-3">
          {doctors.map(doc => (
            <button
              key={doc.id}
              type="button"
              onClick={() => setSelectedDoctor(doc.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                selectedDoctor === doc.id
                  ? "border-[#24AE7C] bg-[#24AE7C]/5"
                  : "border-[#1E2124] bg-[#0D0F10] hover:border-[#363A3D]"
              }`}
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#1E2124]">
                {doc.image
                  ? <Image src={doc.image} alt={doc.name ?? ""} fill className="object-cover" />
                  : <div className="w-full h-full bg-[#24AE7C]/20 flex items-center justify-center text-[#24AE7C] font-bold">{doc.name?.[0]}</div>
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{doc.name}</p>
                <p className="text-xs text-[#76828D]">{doc.doctorProfile?.specialty}</p>
                {doc.doctorProfile?.consultationFee && (
                  <p className="text-xs text-[#24AE7C] font-medium mt-0.5">${doc.doctorProfile.consultationFee} / visit</p>
                )}
              </div>
              {selectedDoctor === doc.id && (
                <div className="ml-auto w-5 h-5 rounded-full bg-[#24AE7C] flex items-center justify-center shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Available days info */}
      {doctor?.doctorProfile?.availableDays && (
        <div className="flex items-center gap-2 text-sm text-[#ABB8C4] bg-[#1A1D21] border border-[#363A3D] rounded-xl px-4 py-3">
          <CalendarDays size={16} className="text-[#24AE7C]" />
          Available on: <span className="text-white font-medium">{doctor.doctorProfile.availableDays.join(", ")}</span>
        </div>
      )}

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#ABB8C4] flex items-center gap-2">
          <CalendarDays size={15} /> Appointment Date
        </label>
        <input
          type="date"
          min={today}
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full h-11 rounded-xl bg-[#1A1D21] border border-[#363A3D] text-white px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#24AE7C] [color-scheme:dark]"
        />
      </div>

      {/* Time Slot */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[#ABB8C4] flex items-center gap-2">
          <Clock size={15} /> Time Slot
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {TIME_SLOTS.map(slot => (
            <button
              key={slot}
              type="button"
              onClick={() => setTimeSlot(slot)}
              className={`py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                timeSlot === slot
                  ? "border-[#24AE7C] bg-[#24AE7C]/10 text-[#24AE7C]"
                  : "border-[#1E2124] text-[#ABB8C4] hover:border-[#363A3D] hover:text-white"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#ABB8C4]">Reason for Visit <span className="text-[#76828D]">(optional)</span></label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="Describe your symptoms or reason..."
          className="w-full rounded-xl bg-[#1A1D21] border border-[#363A3D] text-white placeholder:text-[#76828D] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#24AE7C] resize-none"
        />
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <Button type="submit" disabled={loading} className="w-full bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold py-5 cursor-pointer">
        {loading ? "Booking..." : "Confirm Appointment"}
      </Button>
    </form>
  );
}
