import { isDueSoon, isOverdue, diffInDays } from './dates'

export function computeKPIs(solicitudes) {
  const total = solicitudes.length
  const resueltas = solicitudes.filter((s) => s.estado === 'Resuelto')

  const tiempoPromedioResolucion = resueltas.length
    ? Math.round(
        (resueltas.reduce(
          (sum, s) => sum + diffInDays(s.fechaResolucion, s.fechaCreacion),
          0,
        ) /
          resueltas.length) *
          10,
      ) / 10
    : 0

  const resueltasDentroDePlazo = resueltas.filter(
    (s) => new Date(s.fechaResolucion) <= new Date(s.fechaEstimada),
  ).length

  const porcentajeDentroDePlazo = resueltas.length
    ? Math.round((resueltasDentroDePlazo / resueltas.length) * 100)
    : 0

  const porCategoria = solicitudes.reduce((acc, s) => {
    acc[s.categoria] = (acc[s.categoria] || 0) + 1
    return acc
  }, {})

  const porEstado = solicitudes.reduce((acc, s) => {
    acc[s.estado] = (acc[s.estado] || 0) + 1
    return acc
  }, {})

  const atrasadas = solicitudes.filter((s) => isOverdue(s))
  const proximasAVencer = solicitudes.filter((s) => isDueSoon(s))

  return {
    total,
    resueltas: resueltas.length,
    tiempoPromedioResolucion,
    porcentajeDentroDePlazo,
    porCategoria,
    porEstado,
    atrasadas,
    proximasAVencer,
  }
}
