import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const doctors = [
  {
    name: "Dr. Alicia Cameron",
    email: "cameron@portal.com",
    image: "/assets/images/dr-cameron.png",
    specialty: "Cardiologist",
    qualifications: "MBBS, MD (Cardiology)",
    bio: "Expert in heart diseases with 12 years of clinical experience.",
    consultationFee: 80,
    experience: 12,
    availableDays: ["Monday", "Wednesday", "Friday"],
  },
  {
    name: "Dr. Sofia Cruz",
    email: "cruz@portal.com",
    image: "/assets/images/dr-cruz.png",
    specialty: "Pediatrician",
    qualifications: "MBBS, DCH",
    bio: "Dedicated to child healthcare and development for over 8 years.",
    consultationFee: 60,
    experience: 8,
    availableDays: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    name: "Dr. James Green",
    email: "green@portal.com",
    image: "/assets/images/dr-green.png",
    specialty: "Orthopedic Surgeon",
    qualifications: "MBBS, MS (Ortho)",
    bio: "Specialist in bone and joint surgery with 15 years of experience.",
    consultationFee: 100,
    experience: 15,
    availableDays: ["Monday", "Tuesday", "Thursday"],
  },
  {
    name: "Dr. Emily Lee",
    email: "lee@portal.com",
    image: "/assets/images/dr-lee.png",
    specialty: "Neurologist",
    qualifications: "MBBS, DM (Neurology)",
    bio: "Focused on brain and nervous system disorders for 10 years.",
    consultationFee: 90,
    experience: 10,
    availableDays: ["Wednesday", "Friday", "Saturday"],
  },
];

async function main() {
  const adminPassword = await hash("Admin@1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@portal.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@portal.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin seeded");

  const doctorPassword = await hash("Doctor@1234", 12);
  for (const doc of doctors) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        name: doc.name,
        email: doc.email,
        password: doctorPassword,
        role: "DOCTOR",
        image: doc.image,
      },
    });

    await prisma.doctorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        specialty: doc.specialty,
        qualifications: doc.qualifications,
        bio: doc.bio,
        consultationFee: doc.consultationFee,
        experience: doc.experience,
        availableDays: doc.availableDays,
        isApproved: true,
        avgRating: 4.8,
        totalReviews: Math.floor(Math.random() * 200) + 50,
      },
    });
    console.log(`✅ Doctor seeded: ${doc.name}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
