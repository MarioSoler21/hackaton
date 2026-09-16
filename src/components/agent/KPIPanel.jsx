import { computeKPIs } from '../../utils/kpis'
import { formatDate } from '../../utils/dates'
import { IconAlertTriangle, IconCheckCircle, IconClock, IconTicket } from '../common/Icons'

function StatCard({ icon: Icon, label, value, helpText, tone = 'navy' }) {
  const tones = {
    navy: 'bg-navy-900 text-white',
    teal: 'bg-teal-text text-white',
    slate: 'bg-white text-navy-950 ring-1 ring-slate-200',
  }
  const helpTones = {
    navy: 'text-white/80',
    teal: 'text-teal-50',
    slate: 'text-slate-500',
  }
  return (
    <dl className={`rounded-xl p-4 shadow-sm ${tones[tone]}`}>
      <dt className="flex items-center gap-2 text-sm font-medium opacity-90">
        <Icon width={18} height={18} />
        {label}
      </dt>
      <dd className="mt-2 text-3xl font-extrabold">{value}</dd>
      {helpText && <dd className={`mt-1 text-xs ${helpTones[tone]}`}>{helpText}</dd>}
    </dl>
  )
}

export function KPIPanel({ solicitudes }) {
  const kpis = computeKPIs(solicitudes)
  const categorias = Object.entries(kpis.porCategoria).sort((a, b) => b[1] - a[1])
  const maxCategoria = Math.max(1, ...categorias.map(([, count]) => count))

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IconTicket} label="Total de solicitudes" value={kpis.total} tone="navy" />
        <StatCard
          icon={IconClock}
          label="Tiempo promedio de resolución"
          value={`${kpis.tiempoPromedioResolucion} días`}
          helpText={`Sobre ${kpis.resueltas} casos resueltos`}
          tone="teal"
        />
        <StatCard
          icon={IconCheckCircle}
          label="Resueltas dentro del plazo"
          value={`${kpis.porcentajeDentroDePlazo}%`}
          tone="slate"
        />
        <StatCard
          icon={IconAlertTriangle}
          label="Casos atrasados"
          value={kpis.atrasadas.length}
          helpText={`${kpis.proximasAVencer.length} próximos a vencer`}
          tone="slate"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="categorias-heading" className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 id="categorias-heading" className="text-base font-bold text-navy-950">
            Solicitudes por categoría
          </h2>
          <ul className="mt-4 space-y-3">
            {categorias.map(([categoria, count]) => (
              <li key={categoria}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{categoria}</span>
                  <span className="font-semibold text-navy-900">{count}</span>
                </div>
                <div aria-hidden="true" className="mt-1 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-teal-text"
                    style={{ width: `${(count / maxCategoria) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="alertas-heading" className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 id="alertas-heading" className="text-base font-bold text-navy-950">
            Casos que requieren atención
          </h2>

          <h3 className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-rose-800">
            <IconAlertTriangle width={16} height={16} />
            Atrasados ({kpis.atrasadas.length})
          </h3>
          {kpis.atrasadas.length === 0 ? (
            <p className="mt-1 text-sm text-slate-500">No hay casos atrasados. Buen trabajo.</p>
          ) : (
            <ul className="mt-1 space-y-1.5">
              {kpis.atrasadas.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-md bg-rose-50 px-2.5 py-1.5 text-sm text-rose-900">
                  <span className="font-mono text-xs">{s.ticket}</span>
                  <span className="truncate px-2">{s.cliente.nombre}</span>
                  <span className="text-xs">Vencía {formatDate(s.fechaEstimada)}</span>
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-amber-800">
            <IconClock width={16} height={16} />
            Próximos a vencer ({kpis.proximasAVencer.length})
          </h3>
          {kpis.proximasAVencer.length === 0 ? (
            <p className="mt-1 text-sm text-slate-500">No hay casos próximos a vencer en las próximas 48 horas.</p>
          ) : (
            <ul className="mt-1 space-y-1.5">
              {kpis.proximasAVencer.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-md bg-amber-50 px-2.5 py-1.5 text-sm text-amber-900">
                  <span className="font-mono text-xs">{s.ticket}</span>
                  <span className="truncate px-2">{s.cliente.nombre}</span>
                  <span className="text-xs">Vence {formatDate(s.fechaEstimada)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
