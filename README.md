# Care Coordination App

Two experiences, one codebase:

- **`/dashboard`** — the caregiver's operations log. Sidebar nav on desktop, bottom tabs on mobile, dense data.
- **`/check-in`** — the elder's screen. Full-screen PWA, one giant button, voice in and voice out.

## Design direction

The two interfaces intentionally *don't* look like the same app skinned twice — a caregiver's dashboard and an
80-year-old's single-purpose device shouldn't share a visual language. What ties them together is one signal:
**amber (`#E2A542`)** always means "something needs a human's attention," whether that's an unconfirmed reminder
dot in the activity log or the breathing mic button waiting to be pressed. Confirmed events are a muted sage
green, never a loud success-green, because a caregiver checking this at 6am doesn't need excitement, just clarity.

- **Dashboard**: warm off-white paper, ink-navy text, a ruled-notebook-style activity feed (`ruled-page` utility
  in `index.css`) — it should feel like a shift log, not a SaaS analytics panel.
- **Elder screen**: brighter cream background, a single amber circle that gently "breathes" when idle and pulses
  faster while listening — modeled on a bedside call button, not a floating action button.
- **Type**: Fraunces (display, used for anything the elder reads or that carries weight on the dashboard) paired
  with Inter (dashboard UI/data). Kept to two families on purpose.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

Visit `/dashboard` for the caregiver portal, `/check-in` for the elder screen (best tested in Chrome or Safari,
which support both `SpeechSynthesis` and `SpeechRecognition`).

```bash
npm run build      # production build + service worker
npm run preview    # serve the production build locally
```

## Structure

```
src/
  router/index.jsx          Phase 1 — two route trees under one router
  layouts/
    DashboardLayout.jsx      Sidebar + mobile tab bar, standard chrome
    ElderLayout.jsx           Full-screen, zero chrome
  pages/
    dashboard/                Overview, Schedule builder, Activity log
    elder/CheckIn.jsx          The voice check-in screen
  components/
    dashboard/                 Sidebar, ScheduleForm (validation), ActivityTimeline
    elder/MicButton.jsx         The signature breathing mic button
  hooks/
    useTextToSpeech.js         Phase 3 — wraps window.speechSynthesis
    useSpeechToText.js         Phase 3 — wraps window.SpeechRecognition
  store/useCareStore.js        Phase 5 — Zustand store for reminders + activity feed
  api/mockApi.js               Phase 5 — mock async "backend" (latency + occasional errors)
```

## Notes on the voice flow (Phase 3)

1. `/check-in` loads the day's pending reminder from the mock API and reads it aloud automatically, once, on mount.
2. Tapping the mic starts `SpeechRecognition`; interim results stream onto the screen as the elder speaks.
3. When recognition ends, the transcript is sent to `submitVoiceResponse` in the store, which calls the mock
   backend's `processVoiceResponse` — a stand-in for a real intent-classification endpoint — and logs the
   outcome into the same activity feed the caregiver dashboard reads from.
4. If the browser doesn't support TTS or STT, the UI degrades gracefully: the prompt is still shown as text, and
   the mic button explains that voice isn't available rather than failing silently.

## PWA (Phase 4)

`vite-plugin-pwa` is configured in `vite.config.js` with `display: 'standalone'` and `start_url: '/check-in'`, so
when installed on the elder's phone it opens full-screen with no browser URL bar. The service worker precaches
the app shell (`navigateFallback: '/check-in'`) so the check-in screen still loads on a poor connection, and
runtime-caches anything under `/api/` with a network-first strategy for when a real backend is wired in.
Placeholder icons are in `public/icons/` — swap these for real artwork before shipping.

## Wiring up a real backend (Phase 5)

Everything currently async lives in `src/api/mockApi.js`. Swap each function's body for a real `fetch` call —
the store (`useCareStore.js`) already treats them as promises that can reject, so loading and error states in
the UI don't need to change.
