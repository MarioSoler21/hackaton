import { useEffect, useRef, useState } from 'react'
import { AGENTES_DEMO, COMPLEJIDADES, ESTADOS, PRIORIDADES } from '../../data/constants'
import { EstadoBadge, PrioridadBadge, ComplejidadBadge } from '../common/Badges'
import { formatDate, formatDateTime } from '../../utils/dates'
import { IconFile, IconX } from '../common/Icons'

export function SolicitudDetailPanel({ solicitud, autorActual, onClose, onClasificar, onCambiarEstado, onAgregarNota }) {
  const dialogRef = useRef(null)
  const headingRef = useRef(null)

  const [prioridad, setPrioridad] = useState(solicitud.prioridad)
  const [complejidad, setComplejidad] = useState(solicitud.complejidad || '')
  const [agenteAsignado, setAgenteAsignado] = useState(solicitud.agenteAsignado || '')
  const [nuevoEstado, setNuevoEstado] = useState(solicitud.estado)
  const [notaEstado, setNotaEstado] = useState('')
  const [notaInterna, setNotaInterna] = useState('')
  const [mensajeGuardado, setMensajeGuardado] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    headingRef.current?.focus()
    // Escape triggers the dialog's native "cancel" then "close" events; the
    // native close (wired to onClose below) already unmounts this panel and
    // returns focus once the browser has actually closed the dialog — a
    // custom cancel handler here would race React's unmount and drop focus.
  }, [])

  function handleClasificar(e) {
    e.preventDefault()
    onClasificar({ prioridad, complejidad: complejidad || null, agenteAsignado: agenteAsignado || null })
    setMensajeGuardado('Clasificación guardada.')
  }

  function handleCambiarEstado(e) {
    e.preventDefault()
    onCambiarEstado(nuevoEstado, { nota: notaEstado.trim() || null, autor: autorActual })
    setNotaEstado('')
    setMensajeGuardado(`Estado actualizado a "${nuevoEstado}".`)
  }

  function handleAgregarNota(e) {
    e.preventDefault()
    if (!notaInterna.trim()) return
    onAgregarNota({ texto: notaInterna.trim(), autor: autorActual })
    setNotaInterna('')
    setMensajeGuardado('Nota interna agregada.')
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="detalle-modal-heading"
      onClose={onClose}
      className="m-auto w-full max-w-2xl rounded-2xl border-0 p-0 backdrop:bg-navy-950/60"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-500">{solicitud.ticket}</p>
          <h2
            id="detalle-modal-heading"
            ref={headingRef}
            tabIndex={-1}
            className="mt-0.5 text-lg font-bold text-navy-950 outline-none"
          >
            {solicitud.categoria}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {solicitud.cliente.nombre} · {solicitud.cliente.email}
          </p>
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Cerrar panel de detalle"
          className="shrink-0 rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        >
          <IconX width={20} height={20} />
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto px-5 py-4 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <EstadoBadge estado={solicitud.estado} />
          <PrioridadBadge prioridad={solicitud.prioridad} />
          <ComplejidadBadge complejidad={solicitud.complejidad} />
        </div>

        <p className="mt-3 text-sm text-slate-700">{solicitud.descripcion}</p>

        {solicitud.archivoAdjunto && (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <IconFile width={16} height={16} className="shrink-0 text-slate-500" />
            <span className="truncate">{solicitud.archivoAdjunto.nombre}</span>
          </div>
        )}

        <p role="status" className="mt-3 min-h-[1.25rem] text-sm font-medium text-teal-text">
          {mensajeGuardado}
        </p>

        <form onSubmit={handleClasificar} className="mt-5 rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-navy-950">Clasificación y asignación</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="prioridad" className="block text-xs font-medium text-slate-600">
                Prioridad
              </label>
              <select
                id="prioridad"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
              >
                {PRIORIDADES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="complejidad" className="block text-xs font-medium text-slate-600">
                Complejidad
              </label>
              <select
                id="complejidad"
                value={complejidad}
                onChange={(e) => setComplejidad(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
              >
                <option value="">Sin definir</option>
                {COMPLEJIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="agente" className="block text-xs font-medium text-slate-600">
                Agente asignado
              </label>
              <select
                id="agente"
                value={agenteAsignado}
                onChange={(e) => setAgenteAsignado(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
              >
                <option value="">Sin asignar</option>
                {AGENTES_DEMO.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            La fecha estimada de resolución se recalcula automáticamente según la prioridad.
          </p>
          <button
            type="submit"
            className="mt-3 rounded-md bg-navy-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-navy-700"
          >
            Guardar clasificación
          </button>
        </form>

        <form onSubmit={handleCambiarEstado} className="mt-4 rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-navy-950">Actualizar estado</h3>
          <div className="mt-3">
            <label htmlFor="nuevo-estado" className="block text-xs font-medium text-slate-600">
              Nuevo estado
            </label>
            <select
              id="nuevo-estado"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="mt-1 block w-full max-w-xs rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <label htmlFor="nota-estado" className="block text-xs font-medium text-slate-600">
              Nota para el cliente (opcional)
            </label>
            <textarea
              id="nota-estado"
              rows={2}
              value={notaEstado}
              onChange={(e) => setNotaEstado(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
            />
          </div>
          <button
            type="submit"
            disabled={nuevoEstado === solicitud.estado}
            className="mt-3 rounded-md bg-teal-text px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-text-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Actualizar estado
          </button>
        </form>

        <div className="mt-4 rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-navy-950">Notas internas</h3>
          {solicitud.notasInternas.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Sin notas internas todavía.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {solicitud.notasInternas.map((n, i) => (
                <li key={i} className="rounded-md bg-slate-50 px-3 py-2 text-sm">
                  <p className="text-slate-700">{n.texto}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {n.autor} · {formatDateTime(n.fecha)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleAgregarNota} className="mt-3">
            <label htmlFor="nota-interna" className="block text-xs font-medium text-slate-600">
              Agregar nota interna (no visible para el cliente)
            </label>
            <textarea
              id="nota-interna"
              rows={2}
              value={notaInterna}
              onChange={(e) => setNotaInterna(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
            />
            <button
              type="submit"
              className="mt-2 rounded-md border border-navy-700 px-4 py-1.5 text-sm font-semibold text-navy-800 hover:bg-navy-50"
            >
              Agregar nota
            </button>
          </form>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Creada el {formatDate(solicitud.fechaCreacion)} · Fecha estimada actual:{' '}
          {formatDate(solicitud.fechaEstimada)}
        </p>
      </div>
    </dialog>
  )
}
