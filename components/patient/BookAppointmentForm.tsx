"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bookAppointment } from "@/app/actions/patient";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import {
  formatAvailableDaysHint,
  isDateOnAvailableDay,
  weekdayFromDateInput,
} from "@/lib/doctor-availability";
import { DatePicker } from "@/components/ui/date-picker";

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
  const availableDays = doctor?.doctorProfile?.availableDays ?? [];
  const hasDayRestriction = availableDays.length > 0;
  const dateAllowed =
    !date || !hasDayRestriction || isDateOnAvailableDay(date, availableDays);

  function pickDoctor(docId: string, docAvailable: string[]) {
    setSelectedDoctor(docId);
    setError("");
    setDate((prev) => {
      if (!prev) return prev;
      if (docAvailable.length > 0 && !isDateOnAvailableDay(prev, docAvailable)) {
        return "";
      }
      return prev;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDoctor || !date || !timeSlot) {
      setError("Please select a doctor, date, and time slot.");
      return;
    }
    if (hasDayRestriction && !isDateOnAvailableDay(date, availableDays)) {
      const dayName = weekdayFromDateInput(date);
      setError(
        `${dayName} is not an available day. This doctor only sees patients on: ${formatAvailableDaysHint(availableDays)}.`
      );
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
        <label className="text-sm font-medium text-app-muted">Select Doctor</label>
        <div className="grid sm:grid-cols-2 gap-3">
          {doctors.map(doc => (
            <button
              key={doc.id}
              type="button"
              onClick={() => pickDoctor(doc.id, doc.doctorProfile?.availableDays ?? [])}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                selectedDoctor === doc.id
                  ? "border-[#24AE7C] bg-[#24AE7C]/5"
                  : "border-app-border bg-app-bg hover:border-app-border-2"
              }`}
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-app-border">
                {doc.image
                  ? <Image src={doc.image} alt={doc.name ?? ""} fill className="object-cover" />
                  : <div className="w-full h-full bg-[#24AE7C]/20 flex items-center justify-center text-[#24AE7C] font-bold">{doc.name?.[0]}</div>
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-app-text truncate">{doc.name}</p>
                <p className="text-xs text-app-subtle">{doc.doctorProfile?.specialty}</p>
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
        <div className="flex items-center gap-2 text-sm text-app-muted bg-app-surface-2 border border-app-border-2 rounded-xl px-4 py-3">
          <CalendarDays size={16} className="text-[#24AE7C]" />
          Available on: <span className="text-app-text font-medium">{doctor.doctorProfile.availableDays.join(", ")}</span>
        </div>
      )}

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-app-muted flex items-center gap-2">
          <CalendarDays size={15} /> Appointment Date
        </label>
        <DatePicker
          value={date}
          min={today}
          hasError={!!(date && hasDayRestriction && !dateAllowed)}
          disabled={(d) => {
            if (!hasDayRestriction) return false;
            const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            return !isDateOnAvailableDay(iso, availableDays);
          }}
          onChange={(v) => {
            setDate(v);
            setError("");
            if (hasDayRestriction && !isDateOnAvailableDay(v, availableDays)) {
              setError(
                `${weekdayFromDateInput(v)} is not available. Pick a: ${formatAvailableDaysHint(availableDays)}.`
              );
            }
          }}
          placeholder="Select appointment date"
        />
        {hasDayRestriction && (
          <p className="text-xs text-app-subtle">
            Available days:{" "}
            <span className="text-app-muted">{formatAvailableDaysHint(availableDays)}</span>
          </p>
        )}
      </div>

      {/* Time Slot */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-app-muted flex items-center gap-2">
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
                  : "border-app-border text-app-muted hover:border-app-border-2 hover:text-app-text"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-app-muted">Reason for Visit <span className="text-app-subtle">(optional)</span></label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="Describe your symptoms or reason..."
          className="w-full rounded-xl bg-app-surface-2 border border-app-border-2 text-app-text placeholder:text-app-subtle px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#24AE7C] resize-none"
        />
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading || (hasDayRestriction && !!date && !dateAllowed)}
        className="w-full bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold py-5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? "Booking..." : "Confirm Appointment"}
      </Button>
    </form>
  );
}
