"use server";

import { prisma } from "@/lib/db";
import { hash, compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

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

export async function updateUserAvatar(imageUrl: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });
  return { success: true };
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) return { error: "No password set on this account" };

  const valid = await compare(data.currentPassword, user.password);
  if (!valid) return { error: "Current password is incorrect" };

  const hashed = await hash(data.newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });
  return { success: true };
}
