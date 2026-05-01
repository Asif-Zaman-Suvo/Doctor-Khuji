"use client";

import { useState } from "react";
import { approveDoctor, rejectDoctor } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export default function DoctorApprovalButton({ userId, isApproved }: { userId: string; isApproved: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle(action: "approve" | "reject") {
    setLoading(true);
    if (action === "approve") await approveDoctor(userId);
    else await rejectDoctor(userId);
    router.refresh();
    setLoading(false);
  }

  if (isApproved) {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-[#24AE7C] bg-[#24AE7C]/10 border border-[#24AE7C]/20 rounded-full px-3 py-1 font-medium">
          <CheckCircle size={13} /> Approved
        </span>
        <button onClick={() => handle("reject")} disabled={loading} className="text-xs text-[#76828D] hover:text-red-400 border border-[#1E2124] hover:border-red-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
          {loading ? "..." : "Revoke"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 font-medium">Pending</span>
      <button onClick={() => handle("approve")} disabled={loading} className="flex items-center gap-1 text-xs bg-[#24AE7C]/10 border border-[#24AE7C]/20 text-[#24AE7C] hover:bg-[#24AE7C]/20 px-3 py-1 rounded-lg transition-colors cursor-pointer">
        <CheckCircle size={13} /> {loading ? "..." : "Approve"}
      </button>
      <button onClick={() => handle("reject")} disabled={loading} className="flex items-center gap-1 text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
        <XCircle size={13} /> Reject
      </button>
    </div>
  );
}
