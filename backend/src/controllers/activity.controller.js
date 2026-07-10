import { prisma } from '../lib/prisma.js'
import { getDemoHouseholdId } from '../lib/demoHousehold.js'

export async function listActivity(req, res) {
  const householdId = await getDemoHouseholdId()
  const events = await prisma.activityEvent.findMany({
    where: { householdId },
    orderBy: { occurredAt: 'desc' },
    take: 50
  })

  res.json(
    events.map((e) => ({
      id: e.id,
      kind: e.kind,
      label: e.label,
      time: formatTime(e.occurredAt)
    }))
  )
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
