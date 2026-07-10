import { prisma } from './prisma.js'

// This is a single-household prototype (see prisma/schema.prisma note).
// Rather than requiring the DB to be seeded before the server can boot,
// this lazily creates the demo household on first use if none exists yet.
let cachedId = process.env.DEMO_HOUSEHOLD_ID || null

export async function getDemoHouseholdId() {
  if (cachedId) return cachedId

  const existing = await prisma.household.findFirst()
  if (existing) {
    cachedId = existing.id
    return cachedId
  }

  const created = await prisma.household.create({
    data: {
      name: "Mom's household",
      elderProfile: { create: { name: 'Mom' } }
    }
  })
  cachedId = created.id
  return cachedId
}
