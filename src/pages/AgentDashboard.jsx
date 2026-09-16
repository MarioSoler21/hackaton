import { useMemo, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { PageHeading } from '../components/common/PageHeading'
import { FiltersBar } from '../components/agent/FiltersBar'
import { SolicitudesTable } from '../components/agent/SolicitudesTable'
import { KPIPanel } from '../components/agent/KPIPanel'
import { SolicitudDetailPanel } from '../components/agent/SolicitudDetailPanel'
import { IconAlertTriangle, IconRefresh } from '../components/common/Icons'
import { isOverdue } from '../utils/dates'

const TABS = [
  { id: 'solicitudes', label: 'Solicitudes' },
  { id: 'indicadores', label: 'Indicadores (KPIs)' },
]

export function AgentDashboard() {
  const { user } = useAuth()
  const { solicitudes, solicitudPorId, clasificarSolicitud, cambiarEstado, agregarNotaInterna, reiniciarDatosDemo } =
    useAppData()

  const [tabActivo, setTabActivo] = useState('solicitudes')
  const [filtros, setFiltros] = useState({ busqueda: '', estado: 'todos', categoria: 'todos', prioridad: 'todos' })
  const [selectedId, setSelectedId] = useState(null)
  const triggerRef = useRef(null)
  const tabRefs = useRef({})

  const filtradas = useMemo(() => {
    return solicitudes.filter((s) => {
      const texto = filtros.busqueda.trim().toLowerCase()
      const coincideTexto =
        !texto ||
        s.ticket.toLowerCase().includes(texto) ||
        s.cliente.nombre.toLowerCase().includes(texto) ||
        s.descripcion.toLowerCase().includes(texto)
      const coincideEstado = filtros.estado === 'todos' || s.estado === filtros.estado
      const coincideCategoria = filtros.categoria === 'todos' || s.categoria === filtros.categoria
      const coincidePrioridad = filtros.prioridad === 'todos' || s.prioridad === filtros.prioridad
      return coincideTexto && coincideEstado && coincideCategoria && coincidePrioridad
    })
  }, [solicitudes, filtros])

  const atrasadasCount = useMemo(() => solicitudes.filter((s) => isOverdue(s)).length, [solicitudes])

  function abrirDetalle(id) {
    triggerRef.current = document.activeElement
    setSelectedId(id)
  }

  function cerrarDetalle() {
    setSelectedId(null)
    triggerRef.current?.focus()
  }

  function handleTabKeyDown(e, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    let nextIndex = index
    if (e.key === 'ArrowLeft') nextIndex = (index - 1 + TABS.length) % TABS.length
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % TABS.length
    if (e.key === 'Home') nextIndex = 0
    if (e.key === 'End') nextIndex = TABS.length - 1
    setTabActivo(TABS[nextIndex].id)
    tabRefs.current[TABS[nextIndex].id]?.focus()
  }

  const seleccionada = selectedId ? solicitudPorId(selectedId) : null

  return (
    <div>
      <PageHeading
        title="Panel de solicitudes"
        subtitle={`${solicitudes.length} solicitudes registradas en el sistema.`}
        actions={
          <button
            type="button"
            onClick={reiniciarDatosDemo}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <IconRefresh width={16} height={16} />
            Reiniciar datos demo
          </button>
        }
      />

      {atrasadasCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <IconAlertTriangle width={18} height={18} className="shrink-0" />
          <p>
            Hay <strong>{atrasadasCount}</strong> solicitud{atrasadasCount === 1 ? '' : 'es'} atrasada
            {atrasadasCount === 1 ? '' : 's'} respecto a su fecha estimada de resolución.
          </p>
        </div>
      )}

      <div role="tablist" aria-label="Vistas del panel" className="mb-4 flex gap-1 border-b border-slate-200">
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={tabActivo === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={tabActivo === tab.id ? 0 : -1}
            onClick={() => setTabActivo(tab.id)}
            onKeyDown={(e) => handleTabKeyDown(e, index)}
            className={`px-4 py-2 text-sm font-semibold ${
              tabActivo === tab.id
                ? 'border-b-2 border-teal-text text-teal-text'
                : 'text-slate-500 hover:text-navy-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="panel-solicitudes"
        role="tabpanel"
        aria-labelledby="tab-solicitudes"
        hidden={tabActivo !== 'solicitudes'}
      >
        <FiltersBar filtros={filtros} onChange={setFiltros} />
        <p role="status" className="mb-3 text-sm text-slate-600">
          Mostrando {filtradas.length} de {solicitudes.length} solicitudes.
        </p>
        <SolicitudesTable solicitudes={filtradas} onVerDetalle={abrirDetalle} />
      </div>

      <div
        id="panel-indicadores"
        role="tabpanel"
        aria-labelledby="tab-indicadores"
        hidden={tabActivo !== 'indicadores'}
      >
        <KPIPanel solicitudes={solicitudes} />
      </div>

      {seleccionada && (
        <SolicitudDetailPanel
          solicitud={seleccionada}
          autorActual={user.nombre}
          onClose={cerrarDetalle}
          onClasificar={(patch) => clasificarSolicitud(seleccionada.id, patch)}
          onCambiarEstado={(estado, opts) => cambiarEstado(seleccionada.id, estado, opts)}
          onAgregarNota={(nota) => agregarNotaInterna(seleccionada.id, nota)}
        />
      )}
    </div>
  )
}
