import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("Qwerty-428", 12);

  const admin = await prisma.admin.upsert({
    where: { email: "cihantuna4141@gmail.com" },
    update: { password: hashed },
    create: {
      firstName: "Cihan",
      lastName: "Erkan",
      email: "cihantuna4141@gmail.com",
      phoneNumber: "+905325848130",
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("Admin created/updated:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
