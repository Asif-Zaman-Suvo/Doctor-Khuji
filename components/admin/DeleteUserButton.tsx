"use client";

import { useState } from "react";
import { deleteUser } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteUserButton({ userId }: { userId: string }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    await deleteUser(userId);
    router.refresh();
  }

  if (confirm) return (
    <div className="flex items-center gap-2">
      <button onClick={handleDelete} disabled={loading} className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-2.5 py-1 rounded-lg cursor-pointer">
        {loading ? "..." : "Delete"}
      </button>
      <button onClick={() => setConfirm(false)} className="text-xs text-[#76828D] hover:text-white cursor-pointer">No</button>
    </div>
  );

  return (
    <button onClick={() => setConfirm(true)} className="p-1.5 rounded-lg text-[#76828D] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
      <Trash2 size={15} />
    </button>
  );
}
