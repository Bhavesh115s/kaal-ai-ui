import { useRef, useState } from "react"

export function useSpeechToText() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [recording, setRecording] = useState(false)

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Microphone not supported")
      return
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    })

    audioChunksRef.current = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data)
    }

    mediaRecorder.start()
    mediaRecorderRef.current = mediaRecorder
    setRecording(true)
  }

  const stopRecording = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current
      if (!recorder) return resolve(null)

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        })

        if (audioBlob.size < 1000) {
          setRecording(false)
          return resolve(null)
        }

        const formData = new FormData()
        formData.append("audio", audioBlob)

        try {
          const res = await fetch("/api/stt", {
            method: "POST",
            body: formData,
          })

          const data = await res.json()
          setRecording(false)

          if (res.ok && data.text) {
            resolve(data.text)
          } else {
            resolve(null)
          }
        } catch {
          setRecording(false)
          resolve(null)
        }
      }

      recorder.stop()
      recorder.stream.getTracks().forEach((t) => t.stop())
    })
  }

  return {
    recording,
    startRecording,
    stopRecording,
  }
}
