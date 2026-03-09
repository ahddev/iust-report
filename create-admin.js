const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('Creating admin user...')
    
    const adminEmail = 'ahed.wka4g@gmail.com'
    const adminPassword = 'Ahed@123'
    
    // Check if admin exists
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (existing) {
      console.log('Admin already exists:', existing.email)
      return
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    // Create admin
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        isAdmin: true
      }
    })
    
    console.log('Admin created successfully!')
    console.log('Email:', admin.email)
    console.log('Admin:', admin.isAdmin)
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()