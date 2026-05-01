"use client";

import { useState } from "react";
import { updateAppointmentStatus } from "@/app/actions/doctor";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export default function AppointmentActionButton({ appointmentId, status }: { appointmentId: string; status: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle(newStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED") {
    setLoading(true);
    await updateAppointmentStatus(appointmentId, newStatus);
    router.refresh();
    setLoading(false);
  }

  if (status === "COMPLETED" || status === "CANCELLED") return null;

  return (
    <div className="flex items-center gap-2">
      {status === "PENDING" && (
        <button onClick={() => handle("CONFIRMED")} disabled={loading} className="flex items-center gap-1 text-xs bg-[#24AE7C]/10 border border-[#24AE7C]/20 text-[#24AE7C] hover:bg-[#24AE7C]/20 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
          <CheckCircle size={13} /> {loading ? "..." : "Confirm"}
        </button>
      )}
      {status === "CONFIRMED" && (
        <button onClick={() => handle("COMPLETED")} disabled={loading} className="flex items-center gap-1 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
          <CheckCircle size={13} /> {loading ? "..." : "Complete"}
        </button>
      )}
      <button onClick={() => handle("CANCELLED")} disabled={loading} className="flex items-center gap-1 text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors">
        <XCircle size={13} /> Cancel
      </button>
    </div>
  );
}
