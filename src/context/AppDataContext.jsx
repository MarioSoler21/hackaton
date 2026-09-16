import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { generarSolicitudesDemo, CLIENTES_DEMO } from '../data/seed'
import { DIAS_ESTIMADOS_POR_PRIORIDAD } from '../data/constants'
import { addDays, toISODate } from '../utils/dates'
import { nextTicketNumber, setTicketCounterFloor, resetTicketCounter } from '../utils/ticket'

const SOLICITUDES_KEY = 'bsp_solicitudes'
const NOTIFS_KEY = 'bsp_notificaciones'
const AppDataContext = createContext(null)

function loadSolicitudes() {
  try {
    const raw = localStorage.getItem(SOLICITUDES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore corrupt storage, reseed */
  }
  const seed = generarSolicitudesDemo()
  setTicketCounterFloor(seed.length)
  localStorage.setItem(SOLICITUDES_KEY, JSON.stringify(seed))
  return seed
}

function loadNotificaciones() {
  try {
    const raw = localStorage.getItem(NOTIFS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function AppDataProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState(loadSolicitudes)
  const [notificaciones, setNotificaciones] = useState(loadNotificaciones)

  useEffect(() => {
    localStorage.setItem(SOLICITUDES_KEY, JSON.stringify(solicitudes))
  }, [solicitudes])

  useEffect(() => {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(notificaciones))
  }, [notificaciones])

  // Keeps client and agent views in sync when opened in separate tabs, so a
  // status change made by the agent is reflected live on the client's page.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === SOLICITUDES_KEY) setSolicitudes(loadSolicitudes())
      if (e.key === NOTIFS_KEY) setNotificaciones(loadNotificaciones())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => {
    function addNotificacion(clienteId, mensaje, solicitud) {
      setNotificaciones((prev) => [
        {
          id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          clienteId,
          mensaje,
          fecha: toISODate(new Date()),
          leida: false,
          solicitudId: solicitud.id,
          ticket: solicitud.ticket,
        },
        ...prev,
      ])
    }

    return {
      solicitudes,
      notificaciones,

      solicitudesPorCliente(clienteId) {
        return solicitudes
          .filter((s) => s.cliente.id === clienteId)
          .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
      },

      solicitudPorId(id) {
        return solicitudes.find((s) => s.id === id) || null
      },

      notificacionesPorCliente(clienteId) {
        return notificaciones
          .filter((n) => n.clienteId === clienteId)
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      },

      crearSolicitud({ clienteId, clienteNombre, clienteEmail, categoria, descripcion, archivoAdjunto }) {
        const clienteExistente = CLIENTES_DEMO.find((c) => c.id === clienteId)
        const cliente = clienteExistente || {
          id: clienteId,
          nombre: clienteNombre,
          email: clienteEmail,
          telefono: '—',
        }
        const ahora = new Date()
        const prioridadInicial = 'Media'
        const nueva = {
          id: `s-${Date.now()}`,
          ticket: nextTicketNumber(),
          cliente,
          categoria,
          descripcion,
          archivoAdjunto,
          estado: 'Recibido',
          prioridad: prioridadInicial,
          complejidad: null,
          agenteAsignado: null,
          fechaCreacion: toISODate(ahora),
          fechaEstimada: toISODate(addDays(ahora, DIAS_ESTIMADOS_POR_PRIORIDAD[prioridadInicial])),
          fechaResolucion: null,
          historial: [{ estado: 'Recibido', fecha: toISODate(ahora), nota: null, autor: null }],
          notasInternas: [],
        }
        setSolicitudes((prev) => [nueva, ...prev])
        return nueva
      },

      clasificarSolicitud(id, { prioridad, complejidad, agenteAsignado }) {
        setSolicitudes((prev) =>
          prev.map((s) => {
            if (s.id !== id) return s
            const nuevaPrioridad = prioridad || s.prioridad
            const fechaEstimada = toISODate(
              addDays(new Date(s.fechaCreacion), DIAS_ESTIMADOS_POR_PRIORIDAD[nuevaPrioridad]),
            )
            return {
              ...s,
              prioridad: nuevaPrioridad,
              complejidad: complejidad || s.complejidad,
              agenteAsignado: agenteAsignado || s.agenteAsignado,
              fechaEstimada,
            }
          }),
        )
      },

      cambiarEstado(id, nuevoEstado, { nota, autor } = {}) {
        const solicitud = solicitudes.find((s) => s.id === id)
        if (!solicitud) return
        const ahora = toISODate(new Date())
        setSolicitudes((prev) =>
          prev.map((s) => {
            if (s.id !== id) return s
            return {
              ...s,
              estado: nuevoEstado,
              fechaResolucion: nuevoEstado === 'Resuelto' ? ahora : s.fechaResolucion,
              historial: [...s.historial, { estado: nuevoEstado, fecha: ahora, nota: nota || null, autor: autor || null }],
            }
          }),
        )
        addNotificacion(
          solicitud.cliente.id,
          `Tu solicitud ${solicitud.ticket} cambió de estado a "${nuevoEstado}".`,
          solicitud,
        )
      },

      agregarNotaInterna(id, { texto, autor }) {
        const ahora = toISODate(new Date())
        setSolicitudes((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, notasInternas: [...s.notasInternas, { fecha: ahora, autor, texto }] }
              : s,
          ),
        )
      },

      marcarNotificacionLeida(notifId) {
        setNotificaciones((prev) => prev.map((n) => (n.id === notifId ? { ...n, leida: true } : n)))
      },

      marcarTodasLeidas(clienteId) {
        setNotificaciones((prev) =>
          prev.map((n) => (n.clienteId === clienteId ? { ...n, leida: true } : n)),
        )
      },

      reiniciarDatosDemo() {
        localStorage.removeItem(SOLICITUDES_KEY)
        localStorage.removeItem(NOTIFS_KEY)
        resetTicketCounter()
        const seed = generarSolicitudesDemo()
        setTicketCounterFloor(seed.length)
        setSolicitudes(seed)
        setNotificaciones([])
      },
    }
  }, [solicitudes, notificaciones])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData debe usarse dentro de AppDataProvider')
  return ctx
}
