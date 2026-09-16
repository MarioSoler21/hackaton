import { Link } from 'react-router-dom'
import { EstadoBadge, AtrasadoBadge, ProximaAVencerBadge } from '../common/Badges'
import { formatDate, isOverdue, isDueSoon } from '../../utils/dates'
import { IconArrowRight, IconFile } from '../common/Icons'

export function SolicitudCard({ solicitud }) {
  const atrasada = isOverdue(solicitud)
  const proximaAVencer = !atrasada && isDueSoon(solicitud)

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-500">{solicitud.ticket}</p>
          <h3 className="mt-0.5 text-base font-semibold text-navy-950">{solicitud.categoria}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {atrasada && <AtrasadoBadge />}
          {proximaAVencer && <ProximaAVencerBadge />}
          <EstadoBadge estado={solicitud.estado} />
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{solicitud.descripcion}</p>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 sm:flex sm:gap-6">
        <div>
          <dt className="inline font-medium text-slate-600">Creada: </dt>
          <dd className="inline">{formatDate(solicitud.fechaCreacion)}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-slate-600">
            {solicitud.estado === 'Resuelto' ? 'Resuelta: ' : 'Fecha estimada: '}
          </dt>
          <dd className="inline">
            {formatDate(solicitud.estado === 'Resuelto' ? solicitud.fechaResolucion : solicitud.fechaEstimada)}
          </dd>
        </div>
        {solicitud.archivoAdjunto && (
          <div className="flex items-center gap-1 text-slate-500">
            <IconFile width={14} height={14} />
            <span>Con adjunto</span>
          </div>
        )}
      </dl>

      <Link
        to={`/cliente/solicitud/${solicitud.id}`}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-text hover:text-teal-text-hover"
      >
        Ver seguimiento de {solicitud.ticket}
        <IconArrowRight width={16} height={16} />
      </Link>
    </li>
  )
}
