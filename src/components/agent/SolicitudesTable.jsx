import { useMemo, useState } from 'react'
import { EstadoBadge, PrioridadBadge, AtrasadoBadge, ProximaAVencerBadge } from '../common/Badges'
import { formatDate, isOverdue, isDueSoon } from '../../utils/dates'

const COLUMNAS = [
  { key: 'ticket', label: 'Ticket', sortable: true },
  { key: 'cliente', label: 'Cliente', sortable: true },
  { key: 'categoria', label: 'Categoría', sortable: true },
  { key: 'prioridad', label: 'Prioridad', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'fechaEstimada', label: 'Fecha estimada', sortable: true },
  { key: 'acciones', label: 'Acciones', sortable: false },
]

const PRIORIDAD_ORDEN = { Alta: 0, Media: 1, Baja: 2 }

function valorOrdenable(s, key) {
  switch (key) {
    case 'cliente':
      return s.cliente.nombre
    case 'prioridad':
      return PRIORIDAD_ORDEN[s.prioridad]
    case 'fechaEstimada':
      return new Date(s.fechaEstimada).getTime()
    default:
      return s[key]
  }
}

export function SolicitudesTable({ solicitudes, onVerDetalle }) {
  const [orden, setOrden] = useState({ key: 'fechaEstimada', dir: 'asc' })

  const ordenadas = useMemo(() => {
    const copia = [...solicitudes]
    copia.sort((a, b) => {
      const va = valorOrdenable(a, orden.key)
      const vb = valorOrdenable(b, orden.key)
      if (va < vb) return orden.dir === 'asc' ? -1 : 1
      if (va > vb) return orden.dir === 'asc' ? 1 : -1
      return 0
    })
    return copia
  }, [solicitudes, orden])

  function toggleOrden(key) {
    setOrden((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )
  }

  return (
    <div
      role="region"
      aria-label="Listado de solicitudes"
      tabIndex={0}
      className="overflow-x-auto rounded-xl border border-slate-200 bg-white"
    >
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <caption className="sr-only">
          Listado de solicitudes y reclamos de clientes, con su estado, prioridad y fecha estimada de resolución.
        </caption>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            {COLUMNAS.map((col) => (
              <th key={col.key} scope="col" className="px-4 py-3" aria-sort={
                col.sortable ? (orden.key === col.key ? (orden.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined
              }>
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleOrden(col.key)}
                    className="flex items-center gap-1 hover:text-navy-800"
                  >
                    {col.label}
                    <span aria-hidden="true" className="text-slate-400">
                      {orden.key === col.key ? (orden.dir === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ordenadas.length === 0 && (
            <tr>
              <td colSpan={COLUMNAS.length} className="px-4 py-8 text-center text-sm text-slate-500">
                No hay solicitudes que coincidan con los filtros seleccionados.
              </td>
            </tr>
          )}
          {ordenadas.map((s) => {
            const atrasada = isOverdue(s)
            const proximaAVencer = !atrasada && isDueSoon(s)
            return (
              <tr key={s.id} className="align-top hover:bg-slate-50">
                <th scope="row" className="px-4 py-3 text-left font-mono text-xs font-semibold text-navy-900">
                  {s.ticket}
                </th>
                <td className="px-4 py-3 text-slate-700">{s.cliente.nombre}</td>
                <td className="px-4 py-3 text-slate-700">{s.categoria}</td>
                <td className="px-4 py-3">
                  <PrioridadBadge prioridad={s.prioridad} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1.5">
                    <EstadoBadge estado={s.estado} />
                    {atrasada && <AtrasadoBadge />}
                    {proximaAVencer && <ProximaAVencerBadge />}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {s.estado === 'Resuelto' ? formatDate(s.fechaResolucion) : formatDate(s.fechaEstimada)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onVerDetalle(s.id)}
                    aria-label={`Ver detalle de la solicitud ${s.ticket}`}
                    className="rounded-md border border-navy-700 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-50"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
