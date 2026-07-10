export default function MicButton({ isListening, isSpeaking, onPress, disabled }) {
  const label = isSpeaking ? 'Wait for the question to finish' : isListening ? 'Listening…' : 'Tap to answer'

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={onPress}
        disabled={disabled}
        aria-label={label}
        className={`relative flex h-56 w-56 items-center justify-center rounded-full bg-signal shadow-[0_18px_40px_-12px_rgba(226,165,66,0.55)] transition-transform focus-visible:outline-offset-4 disabled:opacity-40 ${
          isListening ? 'animate-listening' : 'animate-breathe'
        }`}
      >
        <MicIcon isListening={isListening} />
      </button>
      <p className="font-display text-2xl font-semibold text-elder-ink">{label}</p>
    </div>
  )
}

function MicIcon({ isListening }) {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#FFFDF8" />
      <path
        d="M5 11a7 7 0 0 0 14 0"
        stroke="#FFFDF8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M12 18v3" stroke="#FFFDF8" strokeWidth="2" strokeLinecap="round" />
      {isListening && (
        <circle cx="12" cy="12" r="11" stroke="#FFFDF8" strokeWidth="1" opacity="0.4" fill="none" />
      )}
    </svg>
  )
}
