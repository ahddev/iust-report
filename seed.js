const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seed() {
  try {
    console.log('Starting database seed...')
    
    const adminEmail = 'ahed.wka4g@gmail.com'
    const adminPassword = 'Ahed@123'
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email)
      console.log('Admin status:', existingAdmin.isAdmin)
      return
    }
    
    // Create admin user
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
    
    console.log(' Admin user created successfully!')
    console.log('Email:', admin.email)
    console.log('Admin status:', admin.isAdmin)
    console.log('Created at:', admin.createdAt)
    
  } catch (error) {
    console.error(' Error seeding database:', error)
  } finally {
    await prisma.()
  }
}

seed()
