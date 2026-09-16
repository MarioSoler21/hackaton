import { useEffect, useRef } from 'react'
import { useAnnouncer } from '../../context/AnnouncerContext'
import { PLATAFORMA_NOMBRE } from '../../data/constants'

// Renders the page's single <h1>, updates the document title, moves focus
// to the heading, and announces the navigation — the SPA equivalent of a
// full page load for screen reader users. Use exactly one per route.
export function PageHeading({ title, subtitle, actions }) {
  const headingRef = useRef(null)
  const announce = useAnnouncer()

  useEffect(() => {
    document.title = `${title} · ${PLATAFORMA_NOMBRE}`
    headingRef.current?.focus()
    announce(`Navegaste a: ${title}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-bold tracking-tight text-navy-950 outline-none sm:text-3xl"
        >
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600 sm:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
