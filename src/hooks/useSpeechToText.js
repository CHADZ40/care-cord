import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Wraps window.SpeechRecognition / webkitSpeechRecognition.
 * Exposes a transcript that updates live (interim + final results),
 * plus isListening / isSupported / error for the UI to react to.
 */
export function useSpeechToText({ lang = 'en-US' } = {}) {
  const RecognitionCtor =
    typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!RecognitionCtor) return
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
    return () => recognition.abort()
  }, [RecognitionCtor, lang])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    setError(null)
    setTranscript('')
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch {
      // start() throws if already started — safe to ignore
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
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
