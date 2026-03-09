import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'ahed.wka4g@gmail.com'
  const adminPassword = 'Ahed@123'

  console.log('Starting database seed...')

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    console.log('Creating admin user...')
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        isAdmin: true
      }
    })

    console.log('Admin user created:', admin.email)
  } else {
    console.log('Admin user already exists:', existingAdmin.email)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })