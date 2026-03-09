import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('Authorize called with:', { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }
//saasa
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log('User found:', user ? { id: user.id, email: user.email, isAdmin: user.isAdmin } : 'No user found')

          if (!user) {
            console.log('User not found')
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log('Password valid:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('Invalid password')
            return null
          }

          console.log('Authentication successful')
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}