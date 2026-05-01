"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updatePatientProfile(data: {
  dateOfBirth?: string;
  bloodGroup?: string;
  gender?: string;
  address?: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Unauthorized" };

  await prisma.patientProfile.upsert({
    where: { userId },
    update: {
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      bloodGroup: data.bloodGroup || null,
      gender: data.gender || null,
      address: data.address || null,
    },
    create: {
      userId,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      bloodGroup: data.bloodGroup || null,
      gender: data.gender || null,
      address: data.address || null,
    },
  });

  revalidatePath("/dashboard/patient");
  revalidatePath("/dashboard/patient/settings");
  return { success: true };
}

export async function updateUserInfo(data: { name?: string; phone?: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Unauthorized" };

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name || undefined,
      phone: data.phone || undefined,
    },
  });

  revalidatePath("/dashboard/patient");
  revalidatePath("/dashboard/patient/settings");
  return { success: true };
}

export async function bookAppointment(data: {
  doctorId: string;
  date: string;
  timeSlot: string;
  reason?: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Unauthorized" };

  const existing = await prisma.appointment.findFirst({
    where: {
      doctorId: data.doctorId,
      date: new Date(data.date),
      timeSlot: data.timeSlot,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (existing) return { error: "This time slot is already booked. Please choose another." };

  await prisma.appointment.create({
    data: {
      patientId: userId,
      doctorId: data.doctorId,
      date: new Date(data.date),
      timeSlot: data.timeSlot,
      reason: data.reason || null,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard/patient/appointments");
  revalidatePath("/dashboard/patient");
  return { success: true };
}

export async function cancelAppointment(appointmentId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Unauthorized" };

  const appt = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appt || appt.patientId !== userId) return { error: "Not found" };
  if (appt.status === "CANCELLED") return { error: "Already cancelled" };

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/dashboard/patient/appointments");
  revalidatePath("/dashboard/patient");
  return { success: true };
}
