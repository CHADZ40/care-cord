import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Wraps window.speechSynthesis. Speaks slowly and clearly by default,
 * which matters a lot for an elderly listener.
 */
export function useTextToSpeech({ rate = 0.92, pitch = 1, lang = 'en-US' } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window)
  const utteranceRef = useRef(null)

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text) return
      window.speechSynthesis.cancel() // stop anything already queued

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.lang = lang
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [isSupported, rate, pitch, lang]
  )

  const cancel = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  useEffect(() => () => cancel(), [cancel])

  return { speak, cancel, isSpeaking, isSupported }
}
