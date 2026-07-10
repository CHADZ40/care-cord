import { Outlet } from 'react-router-dom'

// No nav bar, no chrome. This is the entire screen an elderly user sees.
// dvh is used (via h-dvh-safe utility) instead of vh so mobile browser
// chrome show/hide doesn't cause the background to jump or "zoom".
export default function ElderLayout() {
  return (
    <div className="h-dvh-safe w-full overflow-hidden bg-elder-bg text-elder-ink">
      <Outlet />
    </div>
  )
}
