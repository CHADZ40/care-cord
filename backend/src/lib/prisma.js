import { PrismaClient } from '@prisma/client'

// A single shared client, so we don't open a new connection pool per request
// (important with dev's --watch restarts too, hence the globalThis cache).
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
