"use client";

import { useState } from "react";
import { adminUpdateAppointmentStatus } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export default function AppointmentStatusButton({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle(newStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED") {
    setLoading(true);
    await adminUpdateAppointmentStatus(appointmentId, newStatus);
    router.refresh();
    setLoading(false);
  }

  if (status === "COMPLETED" || status === "CANCELLED") return null;

  return (
    <div className="flex items-center gap-2">
      {status === "PENDING" && (
        <button onClick={() => handle("CONFIRMED")} disabled={loading} className="text-xs bg-[#24AE7C]/10 border border-[#24AE7C]/20 text-[#24AE7C] hover:bg-[#24AE7C]/20 px-2.5 py-1 rounded-lg cursor-pointer">
          Confirm
        </button>
      )}
      {status === "CONFIRMED" && (
        <button onClick={() => handle("COMPLETED")} disabled={loading} className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg cursor-pointer">
          Complete
        </button>
      )}
      <button onClick={() => handle("CANCELLED")} disabled={loading} className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-2.5 py-1 rounded-lg cursor-pointer">
        Cancel
      </button>
    </div>
  );
}
