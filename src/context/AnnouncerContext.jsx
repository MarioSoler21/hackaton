import { createContext, useCallback, useContext, useRef, useState } from 'react'

// Dedicated, isolated live region for status/route announcements. Kept
// separate from any visual timeline or list so re-renders of those
// components never cause the whole thing to be re-read by a screen reader.
const AnnouncerContext = createContext(null)

export function AnnouncerProvider({ children }) {
  const [message, setMessage] = useState('')
  const timeoutRef = useRef(null)

  const announce = useCallback((text) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    // Clear first so identical consecutive messages are still announced.
    setMessage('')
    timeoutRef.current = setTimeout(() => setMessage(text), 50)
  }, [])

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <div aria-live="polite" aria-atomic="true" role="status" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {message}
      </div>
    </AnnouncerContext.Provider>
  )
}

export function useAnnouncer() {
  const ctx = useContext(AnnouncerContext)
  if (!ctx) throw new Error('useAnnouncer debe usarse dentro de AnnouncerProvider')
  return ctx
}
