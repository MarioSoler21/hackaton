import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { useAnnouncer } from '../../context/AnnouncerContext'
import { formatDateTime } from '../../utils/dates'
import { IconBell } from '../common/Icons'

export function NotificationsMenu({ clienteId }) {
  const { notificacionesPorCliente, marcarNotificacionLeida, marcarTodasLeidas } = useAppData()
  const [abierto, setAbierto] = useState(false)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const navigate = useNavigate()
  const announce = useAnnouncer()

  const notificaciones = notificacionesPorCliente(clienteId)
  const noLeidas = notificaciones.filter((n) => !n.leida).length
  const noLeidasRef = useRef(noLeidas)

  useEffect(() => {
    if (noLeidas > noLeidasRef.current) {
      const nuevas = noLeidas - noLeidasRef.current
      announce(nuevas === 1 ? 'Nueva notificación recibida.' : `${nuevas} notificaciones nuevas recibidas.`)
    }
    noLeidasRef.current = noLeidas
  }, [noLeidas, announce])

  useEffect(() => {
    if (!abierto) return
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setAbierto(false)
        buttonRef.current?.focus()
      }
    }
    function onClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [abierto])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="notificaciones-panel"
        aria-label={`Notificaciones${noLeidas > 0 ? `, ${noLeidas} sin leer` : ''}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
      >
        <IconBell />
        {noLeidas > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-brand px-1 text-[10px] font-bold text-navy-950"
          >
            {noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div
          ref={panelRef}
          id="notificaciones-panel"
          role="region"
          aria-labelledby="notificaciones-panel-heading"
          className="absolute right-0 z-40 mt-2 w-80 max-w-[90vw] rounded-xl bg-white p-2 text-slate-900 shadow-xl ring-1 ring-slate-200"
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <h2 id="notificaciones-panel-heading" className="text-sm font-semibold text-navy-950">
              Notificaciones
            </h2>
            {noLeidas > 0 && (
              <button
                type="button"
                onClick={() => marcarTodasLeidas(clienteId)}
                className="text-xs font-medium text-teal-text hover:text-teal-text-hover"
              >
                Marcar todas leídas
              </button>
            )}
          </div>
          {notificaciones.length === 0 ? (
            <p className="px-2 py-4 text-sm text-slate-500">No tienes notificaciones todavía.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notificaciones.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      marcarNotificacionLeida(n.id)
                      setAbierto(false)
                      navigate(`/cliente/solicitud/${n.solicitudId}`)
                    }}
                    className={`w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50 ${!n.leida ? 'bg-teal-brand-light/60' : ''}`}
                  >
                    <span className="flex items-start gap-2">
                      {!n.leida && (
                        <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-brand" />
                      )}
                      <span>
                        <span className="block text-slate-800">{n.mensaje}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{formatDateTime(n.fecha)}</span>
                        {!n.leida && <span className="sr-only"> (sin leer)</span>}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
