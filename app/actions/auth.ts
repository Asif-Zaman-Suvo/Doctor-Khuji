"use server";

import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "PATIENT" | "DOCTOR";
}) {
  const existing = await prisma.user.findUnique({
    where: { email: formData.email },
  });

  if (existing) {
    return { error: "Email already in use" };
  }

  const hashedPassword = await hash(formData.password, 12);

  await prisma.user.create({
    data: {
      name: formData.name,
      email: formData.email,
      password: hashedPassword,
      phone: formData.phone ?? null,
      role: formData.role,
    },
  });

  redirect("/login?registered=true");
}
