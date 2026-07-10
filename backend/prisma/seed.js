import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const household = await prisma.household.create({
    data: {
      name: "Mom's household",
      elderProfile: { create: { name: 'Mom' } },
      reminders: {
        create: [
          { task: 'Take blood pressure pill', time: '08:00', frequency: 'Daily' },
          { task: 'Afternoon walk', time: '15:00', frequency: 'Weekly' }
        ]
      }
    },
    include: { reminders: true }
  })

  await prisma.activityEvent.createMany({
    data: [
      { householdId: household.id, kind: 'prompt', label: 'Medication prompt sent', reminderId: household.reminders[0].id },
      { householdId: household.id, kind: 'confirmed', label: 'Elder confirmed: "Yes, just took it"', reminderId: household.reminders[0].id }
    ]
  })

  console.log(`Seeded household ${household.id} ("${household.name}")`)
  console.log('Copy this id into DEMO_HOUSEHOLD_ID in your .env if it differs from the default.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
