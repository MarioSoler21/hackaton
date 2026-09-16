import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { useAnnouncer } from '../context/AnnouncerContext'
import { PageHeading } from '../components/common/PageHeading'
import { EstadoBadge, AtrasadoBadge, ProximaAVencerBadge } from '../components/common/Badges'
import { Timeline } from '../components/client/Timeline'
import { formatDate, isOverdue, isDueSoon } from '../utils/dates'
import { IconFile } from '../components/common/Icons'

export function ClientRequestDetail() {
  const { id } = useParams()
  const { solicitudPorId } = useAppData()
  const announce = useAnnouncer()
  const solicitud = solicitudPorId(id)
  const estadoAnteriorRef = useRef(solicitud?.estado)

  useEffect(() => {
    if (!solicitud) return
    if (estadoAnteriorRef.current && estadoAnteriorRef.current !== solicitud.estado) {
      announce(`Tu solicitud ${solicitud.ticket} cambió a: ${solicitud.estado}.`)
    }
    estadoAnteriorRef.current = solicitud.estado
  }, [solicitud, announce])

  if (!solicitud) {
    return (
      <div>
        <PageHeading title="Solicitud no encontrada" />
        <p className="text-slate-600">
          No encontramos esa solicitud.{' '}
          <Link to="/cliente" className="font-semibold text-teal-text hover:text-teal-text-hover">
            Volver a mis solicitudes
          </Link>
          .
        </p>
      </div>
    )
  }

  const atrasada = isOverdue(solicitud)
  const proximaAVencer = !atrasada && isDueSoon(solicitud)

  return (
    <div>
      <PageHeading
        title={`Solicitud ${solicitud.ticket}`}
        subtitle={solicitud.categoria}
        actions={
          <Link
            to="/cliente"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Volver a mis solicitudes
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
        <section aria-labelledby="detalle-heading" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 id="detalle-heading" className="text-base font-bold text-navy-950">
            Detalle de la solicitud
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            <EstadoBadge estado={solicitud.estado} />
            {atrasada && <AtrasadoBadge />}
            {proximaAVencer && <ProximaAVencerBadge />}
          </div>

          <p className="mt-4 text-sm text-slate-700">{solicitud.descripcion}</p>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Fecha de creación</dt>
              <dd className="font-medium text-slate-800">{formatDate(solicitud.fechaCreacion)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">
                {solicitud.estado === 'Resuelto' ? 'Fecha de resolución' : 'Fecha estimada de resolución'}
              </dt>
              <dd className="font-medium text-slate-800">
                {formatDate(solicitud.estado === 'Resuelto' ? solicitud.fechaResolucion : solicitud.fechaEstimada)}
              </dd>
            </div>
          </dl>

          {solicitud.archivoAdjunto && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <IconFile width={16} height={16} className="shrink-0 text-slate-500" />
              <span className="truncate">{solicitud.archivoAdjunto.nombre}</span>
            </div>
          )}
        </section>

        <section aria-labelledby="seguimiento-heading" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 id="seguimiento-heading" className="text-base font-bold text-navy-950">
            Seguimiento
          </h2>
          <div className="mt-4">
            <Timeline solicitud={solicitud} />
          </div>
        </section>
      </div>
    </div>
  )
}
