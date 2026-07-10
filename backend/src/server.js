import 'dotenv/config'
import { createApp } from './app.js'

const port = process.env.PORT || 4000
const app = createApp()

app.listen(port, () => {
  console.log(`Care Coordination API listening on http://localhost:${port}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('ANTHROPIC_API_KEY not set — voice responses will use the keyword-matching fallback.')
  }
})
