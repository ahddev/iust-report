const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
async function main() {
  try {
    const adminEmail = "ahed.wka4g@gmail.com";
    const adminPassword = "Ahed@123";
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: "Admin User",
          isAdmin: true,
        },
      });
      console.log("Admin created:", admin.email);
    } else {
      console.log("Admin exists:", existing.email);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
