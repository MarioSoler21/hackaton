import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { PageHeading } from '../components/common/PageHeading'
import { SolicitudCard } from '../components/client/SolicitudCard'
import { ESTADOS } from '../data/constants'
import { IconPlus } from '../components/common/Icons'

export function ClientDashboard() {
  const { user } = useAuth()
  const { solicitudesPorCliente } = useAppData()
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const todas = solicitudesPorCliente(user.clienteId)

  const filtradas = useMemo(() => {
    return todas.filter((s) => {
      const coincideEstado = filtroEstado === 'todos' || s.estado === filtroEstado
      const texto = busqueda.trim().toLowerCase()
      const coincideTexto =
        !texto || s.ticket.toLowerCase().includes(texto) || s.categoria.toLowerCase().includes(texto)
      return coincideEstado && coincideTexto
    })
  }, [todas, filtroEstado, busqueda])

  return (
    <div>
      <PageHeading
        title="Mis solicitudes"
        subtitle={`Tienes ${todas.length} solicitud${todas.length === 1 ? '' : 'es'} registrada${todas.length === 1 ? '' : 's'}.`}
        actions={
          <Link
            to="/cliente/nueva"
            className="inline-flex items-center gap-1.5 rounded-md bg-teal-text px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-text-hover"
          >
            <IconPlus width={16} height={16} />
            Nueva solicitud
          </Link>
        }
      />

      {todas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">Todavía no has creado ninguna solicitud.</p>
          <Link
            to="/cliente/nueva"
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-teal-text px-4 py-2 text-sm font-semibold text-white hover:bg-teal-text-hover"
          >
            Crear mi primera solicitud
          </Link>
        </div>
      ) : (
        <>
          <fieldset className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <legend className="sr-only">Filtrar mis solicitudes</legend>
            <div>
              <label htmlFor="busqueda" className="block text-xs font-medium text-slate-600">
                Buscar por ticket o categoría
              </label>
              <input
                id="busqueda"
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej. BSP-2026-00001"
                className="mt-1 w-56 max-w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
              />
            </div>
            <div>
              <label htmlFor="filtro-estado" className="block text-xs font-medium text-slate-600">
                Estado
              </label>
              <select
                id="filtro-estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="mt-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
              >
                <option value="todos">Todos</option>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <p role="status" className="mb-3 text-sm text-slate-600">
            Mostrando {filtradas.length} de {todas.length} solicitudes.
          </p>

          {filtradas.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              No hay solicitudes que coincidan con tu búsqueda.
            </p>
          ) : (
            <ul className="space-y-3">
              {filtradas.map((s) => (
                <SolicitudCard key={s.id} solicitud={s} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
