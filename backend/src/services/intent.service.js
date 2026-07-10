import Anthropic from '@anthropic-ai/sdk'

const VALID_INTENTS = ['confirmed', 'declined', 'concern', 'unclear']

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

/**
 * Classifies a transcribed voice response from the elder interface into one
 * of: confirmed | declined | concern | unclear.
 *
 * If ANTHROPIC_API_KEY is set, this asks Claude to classify it — far more
 * robust than keyword matching ("I already did that this morning" vs.
 * "no, not yet" both need to be understood correctly). Without a key, it
 * falls back to the same regex heuristic the frontend mock used, so the
 * app still works end-to-end without any API key during setup.
 */
export async function classifyIntent(transcript, { reminderTask } = {}) {
  if (client) {
    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-5',
        max_tokens: 20,
        system:
          'You classify an elderly user\'s spoken reply to a caregiving reminder. ' +
          'Respond with exactly one word, no punctuation: confirmed, declined, concern, or unclear. ' +
          '"confirmed" = they did the task. "declined" = they have not done it yet but are otherwise fine. ' +
          '"concern" = they mention pain, injury, confusion, or ask for help. ' +
          '"unclear" = the reply does not answer the question.',
        messages: [
          {
            role: 'user',
            content: `Reminder: "${reminderTask ?? 'the task'}"\nElder's reply: "${transcript}"`
          }
        ]
      })

      const raw = message.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('')
        .trim()
        .toLowerCase()

      if (VALID_INTENTS.includes(raw)) return raw
      // Model didn't return a clean single word — fall through to heuristic below.
    } catch (err) {
      console.error('Claude classification failed, falling back to heuristic:', err.message)
    }
  }

  return classifyWithHeuristic(transcript)
}

function classifyWithHeuristic(transcript) {
  const text = transcript.toLowerCase()
  if (/\b(yes|yeah|yep|did|took|done)\b/.test(text)) return 'confirmed'
  if (/\b(no|not yet|haven't|didn't)\b/.test(text)) return 'declined'
  if (/\b(help|hurt|pain|dizzy|fell)\b/.test(text)) return 'concern'
  return 'unclear'
}
