"use client";

import { useState } from "react";
import { cancelAppointment } from "@/app/actions/patient";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function CancelButton({ appointmentId }: { appointmentId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    setLoading(true);
    await cancelAppointment(appointmentId);
    router.refresh();
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleCancel} disabled={loading} className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
          {loading ? "..." : "Confirm"}
        </button>
        <button onClick={() => setConfirm(false)} className="text-xs text-[#76828D] hover:text-white cursor-pointer">
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-1 text-xs text-[#76828D] hover:text-red-400 border border-[#1E2124] hover:border-red-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
    >
      <X size={12} /> Cancel
    </button>
  );
}
