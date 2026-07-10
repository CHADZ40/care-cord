import { useEffect, useRef, useState } from 'react'
import { useCareStore } from '../../store/useCareStore'
import { useTextToSpeech } from '../../hooks/useTextToSpeech'
import { useSpeechToText } from '../../hooks/useSpeechToText'
import MicButton from '../../components/elder/MicButton'

export default function CheckIn() {
  const pendingReminder = useCareStore((s) => s.pendingReminder)
  const loadPendingReminder = useCareStore((s) => s.loadPendingReminder)
  const submitVoiceResponse = useCareStore((s) => s.submitVoiceResponse)

  const { speak, isSpeaking, isSupported: ttsSupported } = useTextToSpeech()
  const {
    transcript,
    isListening,
    error: sttError,
    startListening,
    stopListening,
    isSupported: sttSupported
  } = useSpeechToText()

  const [result, setResult] = useState(null) // 'sending' | 'confirmed' | 'declined' | 'concern' | 'unclear'
  const hasSpokenRef = useRef(false)

  // Load today's reminder, then read it out loud automatically once.
  useEffect(() => {
    loadPendingReminder()
  }, [loadPendingReminder])

  useEffect(() => {
    if (pendingReminder && !hasSpokenRef.current) {
      hasSpokenRef.current = true
      speak(pendingReminder.prompt)
    }
  }, [pendingReminder, speak])

  // When recognition finishes with a transcript, send it off.
  useEffect(() => {
    if (!isListening && transcript && result === null) {
      handleSend(transcript)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening])

  async function handleSend(text) {
    setResult('sending')
    try {
      const response = await submitVoiceResponse(text)
      setResult(response.intent)
    } catch {
      setResult('unclear')
    }
  }

  function handlePress() {
    if (isSpeaking) return
    if (isListening) {
      stopListening()
    } else {
      setResult(null)
      startListening()
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-between px-6 py-10 text-center">
      <div className="w-2 h-2" aria-hidden="true" />

      <div className="max-w-md space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-elder-ink/50">
          Check in
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-elder-ink">
          {pendingReminder?.prompt ?? 'Getting your reminder…'}
        </h1>
        {!ttsSupported && (
          <p className="text-sm text-alert">
            This device can't read prompts aloud — please read the question above.
          </p>
        )}
      </div>

      <div>
        <MicButton
          isListening={isListening}
          isSpeaking={isSpeaking}
          onPress={handlePress}
          disabled={!sttSupported || !pendingReminder}
        />
        {!sttSupported && (
          <p className="mt-4 max-w-xs text-sm text-alert">
            Voice answers aren't supported in this browser. Try Chrome or Safari.
          </p>
        )}
        {sttSupported && sttError && (
          <p className="mt-4 max-w-xs text-sm text-alert">{describeSttError(sttError)}</p>
        )}
      </div>

      <div className="min-h-[92px] w-full max-w-md">
        {transcript && (
          <p className="rounded-2xl bg-elder-card px-6 py-4 font-display text-xl text-elder-ink shadow-sm">
            “{transcript}”
          </p>
        )}
        <ResultBanner result={result} />
      </div>
    </div>
  )
}

function describeSttError(code) {
  const messages = {
    'not-allowed': "Microphone access was blocked. Check your browser's site settings and allow the microphone, then try again.",
    'service-not-allowed': "Microphone access was blocked. Check your browser's site settings and allow the microphone, then try again.",
    'no-speech': "Didn't hear anything — tap the button and try again.",
    'audio-capture': 'No microphone was found on this device.',
    network: 'Voice recognition needs an internet connection — check your connection and try again.',
    aborted: '' // user-initiated stop, not a real error
  }
  return messages[code] ?? "Something went wrong with voice recognition — tap the button to try again."
}

function ResultBanner({ result }) {
  if (!result) return null
  const copy = {
    sending: { text: 'Sending your answer…', className: 'text-elder-ink/60' },
    confirmed: { text: "Got it — thank you!", className: 'text-confirmed' },
    declined: { text: 'Okay — noted. Someone may check in with you.', className: 'text-signal-deep' },
    concern: { text: "We're letting your family know right away.", className: 'text-alert' },
    unclear: { text: "Didn't quite catch that — tap the button to try again.", className: 'text-elder-ink/60' }
  }[result]

  return <p className={`mt-3 font-display text-lg font-medium ${copy.className}`}>{copy.text}</p>
}
