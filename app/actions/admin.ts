"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function approveDoctor(userId: string) {
  await assertAdmin();
  await prisma.doctorProfile.upsert({
    where: { userId },
    update: { isApproved: true },
    create: { userId, isApproved: true, availableDays: [] },
  });
  revalidatePath("/dashboard/admin/doctors");
  return { success: true };
}

export async function rejectDoctor(userId: string) {
  await assertAdmin();
  await prisma.doctorProfile.update({
    where: { userId },
    data: { isApproved: false },
  });
  revalidatePath("/dashboard/admin/doctors");
  return { success: true };
}

export async function updateUserRole(userId: string, role: "PATIENT" | "DOCTOR" | "ADMIN") {
  await assertAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  await assertAdmin();
  const session = await auth();
  if (userId === session?.user?.id) return { error: "Cannot delete yourself" };
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/admin/users");
  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function adminUpdateAppointmentStatus(
  appointmentId: string,
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED"
) {
  await assertAdmin();
  await prisma.appointment.update({ where: { id: appointmentId }, data: { status } });
  revalidatePath("/dashboard/admin/appointments");
  return { success: true };
}
