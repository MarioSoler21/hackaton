import { ESTADOS } from '../../data/constants'
import { formatDate } from '../../utils/dates'
import { IconCheckCircle } from '../common/Icons'

export function Timeline({ solicitud }) {
  const indiceActual = ESTADOS.indexOf(solicitud.estado)

  return (
    <ol className="relative ml-3 border-l-2 border-slate-200">
      {ESTADOS.map((estado, index) => {
        const esActual = index === indiceActual
        const eventoHistorial = solicitud.historial.find((h) => h.estado === estado)
        const estaHecho = index <= indiceActual

        return (
          <li key={estado} aria-current={esActual ? 'step' : undefined} className="relative pb-8 pl-6 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full ${
                estaHecho ? 'bg-teal-text text-white' : 'bg-white ring-2 ring-slate-300'
              }`}
            >
              {estaHecho && <IconCheckCircle width={13} height={13} strokeWidth={3} />}
            </span>
            <div className={`${esActual ? 'font-bold text-navy-950' : estaHecho ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>
              {estado}
              {esActual && (
                <span className="sr-only">
                  {' '}
                  — paso {index + 1} de {ESTADOS.length}, estado actual
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {eventoHistorial
                ? formatDate(eventoHistorial.fecha)
                : esActual
                  ? 'En curso'
                  : index === ESTADOS.length - 1 && solicitud.estado !== 'Resuelto'
                    ? `Estimado: ${formatDate(solicitud.fechaEstimada)}`
                    : 'Pendiente'}
            </p>
            {eventoHistorial?.nota && (
              <p className="mt-1 max-w-md text-sm text-slate-600">{eventoHistorial.nota}</p>
            )}
          </li>
        )
      })}
    </ol>
  )
}
