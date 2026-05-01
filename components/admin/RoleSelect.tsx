"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export default function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    await updateUserRole(userId, e.target.value as "PATIENT" | "DOCTOR" | "ADMIN");
    router.refresh();
    setLoading(false);
  }

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      disabled={loading}
      className="bg-app-bg border border-app-border-2 text-app-text text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#24AE7C] cursor-pointer disabled:opacity-50"
    >
      <option value="PATIENT">PATIENT</option>
      <option value="DOCTOR">DOCTOR</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
