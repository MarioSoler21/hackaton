import { IconAlertTriangle, IconCheckCircle, IconClock, IconGears, IconSearchReview } from './Icons'

const ESTADO_CONFIG = {
  Recibido: { icon: IconClock, classes: 'bg-slate-100 text-slate-700 ring-slate-300' },
  'En revisión': { icon: IconSearchReview, classes: 'bg-amber-50 text-amber-800 ring-amber-300' },
  'En proceso': { icon: IconGears, classes: 'bg-navy-800/20 text-navy-800 ring-navy-700/50' },
  Resuelto: { icon: IconCheckCircle, classes: 'bg-emerald-50 text-emerald-800 ring-emerald-300' },
}

export function EstadoBadge({ estado }) {
  const config = ESTADO_CONFIG[estado] || ESTADO_CONFIG.Recibido
  const Icon = config.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.classes}`}
    >
      <Icon width={14} height={14} strokeWidth={2.5} />
      {estado}
    </span>
  )
}

const PRIORIDAD_CONFIG = {
  Alta: 'bg-rose-50 text-rose-800 ring-rose-300',
  Media: 'bg-amber-50 text-amber-800 ring-amber-300',
  Baja: 'bg-teal-brand-light text-teal-text ring-teal-brand/40',
}

export function PrioridadBadge({ prioridad }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${PRIORIDAD_CONFIG[prioridad] || PRIORIDAD_CONFIG.Media}`}
    >
      Prioridad {prioridad}
    </span>
  )
}

export function ComplejidadBadge({ complejidad }) {
  if (!complejidad) {
    return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-300">Sin clasificar</span>
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-300">
      Complejidad {complejidad}
    </span>
  )
}

export function AtrasadoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-900 ring-1 ring-inset ring-rose-400">
      <IconAlertTriangle width={14} height={14} strokeWidth={2.5} />
      Atrasada
    </span>
  )
}

export function ProximaAVencerBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-400">
      <IconClock width={14} height={14} strokeWidth={2.5} />
      Próxima a vencer
    </span>
  )
}
