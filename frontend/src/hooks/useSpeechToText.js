import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Wraps window.SpeechRecognition / webkitSpeechRecognition.
 * Exposes a transcript that updates live (interim + final results),
 * plus isListening / isSupported / error for the UI to react to.
 *
 * Deliberately builds a fresh recognition instance inside startListening()
 * rather than once on mount. Creating it in a mount effect is a common
 * source of bugs under React 18 StrictMode (dev only): the effect runs,
 * cleans up, and reruns immediately, which aborts the first instance's
 * in-flight microphone permission request right as the user grants it —
 * looking like "permission popup appears, then it just fails."
 * Building it fresh per press sidesteps that race entirely, and also avoids
 * the "recognition has already started" error some browsers throw if start()
 * is called on an instance that's mid-session from a previous attempt.
 */
export function useSpeechToText({ lang = 'en-US' } = {}) {
  const RecognitionCtor =
    typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  const startListening = useCallback(() => {
    if (!RecognitionCtor) return

    // Tear down any stale instance from a previous attempt first.
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null
      recognitionRef.current.onerror = null
      recognitionRef.current.onend = null
      recognitionRef.current.abort()
      recognitionRef.current = null
    }

    const recognition = new RecognitionCtor()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = lang

    recognition.onresult = (event) => {
      let combined = ''
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript
      }
      setTranscript(combined)
    }

    recognition.onerror = (event) => {
      setError(event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    setError(null)
    setTranscript('')

    try {
      recognition.start()
      setIsListening(true)
    } catch (err) {
      setError(err.message || 'start-failed')
    }
  }, [RecognitionCtor, lang])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  return {
    transcript,
    isListening,
    error,
    isSupported: Boolean(RecognitionCtor),
    startListening,
    stopListening
  }
}
