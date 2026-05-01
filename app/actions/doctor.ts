"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function assertDoctor() {
  const session = await auth();
  if (session?.user?.role !== "DOCTOR") throw new Error("Unauthorized");
  return session.user.id as string;
}

export async function updateDoctorProfile(data: {
  specialty?: string;
  qualifications?: string;
  bio?: string;
  consultationFee?: number;
  experience?: number;
  availableDays?: string[];
}) {
  const userId = await assertDoctor();
  await prisma.doctorProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, availableDays: [], ...data },
  });
  revalidatePath("/dashboard/doctor");
  revalidatePath("/dashboard/doctor/profile");
  return { success: true };
}

export async function updateDoctorUserInfo(data: { name?: string; phone?: string }) {
  const userId = await assertDoctor();
  await prisma.user.update({ where: { id: userId }, data });
  revalidatePath("/dashboard/doctor");
  revalidatePath("/dashboard/doctor/settings");
  return { success: true };
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED"
) {
  const userId = await assertDoctor();
  const appt = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appt || appt.doctorId !== userId) return { error: "Not found" };
  await prisma.appointment.update({ where: { id: appointmentId }, data: { status } });
  revalidatePath("/dashboard/doctor/appointments");
  revalidatePath("/dashboard/doctor");
  return { success: true };
}
