import { addDays, toISODate } from '../utils/dates'
import { DIAS_ESTIMADOS_POR_PRIORIDAD, AGENTES_DEMO } from './constants'

export const CLIENTES_DEMO = [
  { id: 'c1', nombre: 'María Elena Cáceres', email: 'maria.caceres@example.com', telefono: '9988-1122' },
  { id: 'c2', nombre: 'Luis Fernando Ordóñez', email: 'luis.ordonez@example.com', telefono: '9977-3344' },
  { id: 'c3', nombre: 'Gabriela Núñez', email: 'gabriela.nunez@example.com', telefono: '9966-5566' },
  { id: 'c4', nombre: 'Roberto Carlos Amaya', email: 'roberto.amaya@example.com', telefono: '9955-7788' },
  { id: 'c5', nombre: 'Sofía Alejandra Martínez', email: 'sofia.martinez@example.com', telefono: '9944-9900' },
  { id: 'c6', nombre: 'Jorge Alberto Bonilla', email: 'jorge.bonilla@example.com', telefono: '9933-1122' },
  { id: 'c7', nombre: 'Andrea Lissette Paz', email: 'andrea.paz@example.com', telefono: '9922-3344' },
  { id: 'c8', nombre: 'Óscar Danilo Flores', email: 'oscar.flores@example.com', telefono: '9911-5566' },
]

function cliente(id) {
  return CLIENTES_DEMO.find((c) => c.id === id)
}

function buildHistorial(eventos) {
  return eventos.map(({ estado, offset, nota, autor }) => ({
    estado,
    fecha: toISODate(addDays(new Date(), offset)),
    nota: nota || null,
    autor: autor || null,
  }))
}

function buildSolicitud({
  id,
  ticket,
  clienteId,
  categoria,
  descripcion,
  estado,
  prioridad,
  complejidad,
  creadoOffset,
  agente,
  historial,
  notasInternas = [],
  archivoAdjunto = null,
}) {
  const fechaCreacion = addDays(new Date(), creadoOffset)
  const diasEstimados = DIAS_ESTIMADOS_POR_PRIORIDAD[prioridad]
  const fechaEstimada = addDays(fechaCreacion, diasEstimados)
  const resuelto = estado === 'Resuelto'
  const historialConstruido = buildHistorial(historial)
  const eventoResuelto = historialConstruido.find((h) => h.estado === 'Resuelto')

  return {
    id,
    ticket,
    cliente: cliente(clienteId),
    categoria,
    descripcion,
    archivoAdjunto,
    estado,
    prioridad,
    complejidad,
    agenteAsignado: agente || null,
    fechaCreacion: toISODate(fechaCreacion),
    fechaEstimada: toISODate(fechaEstimada),
    fechaResolucion: resuelto ? eventoResuelto.fecha : null,
    historial: historialConstruido,
    notasInternas,
  }
}

export function generarSolicitudesDemo() {
  const A = AGENTES_DEMO
  return [
    buildSolicitud({
      id: 's1', ticket: 'BSP-2026-00001', clienteId: 'c1',
      categoria: 'Cobro indebido',
      descripcion: 'Se me cobró dos veces la membresía anual de la tarjeta de crédito en el mismo mes.',
      estado: 'Resuelto', prioridad: 'Alta', complejidad: 'Media', agente: A[0],
      creadoOffset: -18,
      historial: [
        { estado: 'Recibido', offset: -18 },
        { estado: 'En revisión', offset: -17, autor: A[0] },
        { estado: 'En proceso', offset: -15, autor: A[0], nota: 'Se solicitó reverso a operaciones.' },
        { estado: 'Resuelto', offset: -13, autor: A[0], nota: 'Cobro duplicado reversado y notificado al cliente.' },
      ],
      notasInternas: [{ fecha: toISODate(addDays(new Date(), -13)), autor: A[0], texto: 'Reverso confirmado en sistema core, caso cerrado.' }],
      archivoAdjunto: { nombre: 'estado_cuenta_marzo.pdf', tipo: 'application/pdf' },
    }),
    buildSolicitud({
      id: 's2', ticket: 'BSP-2026-00002', clienteId: 'c2',
      categoria: 'Tarjeta de crédito/débito',
      descripcion: 'Mi tarjeta de débito fue retenida por el cajero automático de Plaza Miraflores.',
      estado: 'Resuelto', prioridad: 'Alta', complejidad: 'Baja', agente: A[1],
      creadoOffset: -25,
      historial: [
        { estado: 'Recibido', offset: -25 },
        { estado: 'En revisión', offset: -25, autor: A[1] },
        { estado: 'En proceso', offset: -24, autor: A[1] },
        { estado: 'Resuelto', offset: -22, autor: A[1], nota: 'Tarjeta recuperada y entregada en agencia.' },
      ],
    }),
    buildSolicitud({
      id: 's3', ticket: 'BSP-2026-00003', clienteId: 'c3',
      categoria: 'Banca en línea / App',
      descripcion: 'No puedo iniciar sesión en la app móvil, me indica error de autenticación constantemente.',
      estado: 'En proceso', prioridad: 'Media', complejidad: 'Media', agente: A[2],
      creadoOffset: -9,
      historial: [
        { estado: 'Recibido', offset: -9 },
        { estado: 'En revisión', offset: -8, autor: A[2] },
        { estado: 'En proceso', offset: -6, autor: A[2], nota: 'Escalado a soporte técnico de banca móvil.' },
      ],
      notasInternas: [{ fecha: toISODate(addDays(new Date(), -6)), autor: A[2], texto: 'Pendiente respuesta del equipo de TI, seguimiento en 48h.' }],
    }),
    buildSolicitud({
      id: 's4', ticket: 'BSP-2026-00004', clienteId: 'c4',
      categoria: 'Transferencias y pagos',
      descripcion: 'Realicé una transferencia interbancaria que no ha llegado al destinatario después de 3 días.',
      estado: 'En proceso', prioridad: 'Alta', complejidad: 'Alta', agente: A[0],
      creadoOffset: -6,
      historial: [
        { estado: 'Recibido', offset: -6 },
        { estado: 'En revisión', offset: -6, autor: A[0] },
        { estado: 'En proceso', offset: -5, autor: A[0], nota: 'En coordinación con banco receptor.' },
      ],
    }),
    buildSolicitud({
      id: 's5', ticket: 'BSP-2026-00005', clienteId: 'c5',
      categoria: 'Préstamos y créditos',
      descripcion: 'Solicito revisión de la tasa de interés aplicada a mi préstamo personal, no coincide con lo pactado.',
      estado: 'En revisión', prioridad: 'Media', complejidad: 'Alta', agente: A[3],
      creadoOffset: -4,
      historial: [
        { estado: 'Recibido', offset: -4 },
        { estado: 'En revisión', offset: -3, autor: A[3] },
      ],
    }),
    buildSolicitud({
      id: 's6', ticket: 'BSP-2026-00006', clienteId: 'c6',
      categoria: 'Atención al cliente',
      descripcion: 'Fui mal atendido en la agencia de Comayagüela, el ejecutivo no resolvió mi consulta.',
      estado: 'Recibido', prioridad: 'Baja', complejidad: 'Baja',
      creadoOffset: -1,
      historial: [{ estado: 'Recibido', offset: -1 }],
    }),
    buildSolicitud({
      id: 's7', ticket: 'BSP-2026-00007', clienteId: 'c7',
      categoria: 'Tarjeta de crédito/débito',
      descripcion: 'Detecto un cargo en mi tarjeta de crédito que no reconozco, posible fraude.',
      estado: 'En proceso', prioridad: 'Alta', complejidad: 'Alta', agente: A[1],
      creadoOffset: -3,
      historial: [
        { estado: 'Recibido', offset: -3 },
        { estado: 'En revisión', offset: -3, autor: A[1] },
        { estado: 'En proceso', offset: -2, autor: A[1], nota: 'Tarjeta bloqueada preventivamente, en investigación de fraude.' },
      ],
      archivoAdjunto: { nombre: 'captura_movimiento.png', tipo: 'image/png' },
    }),
    buildSolicitud({
      id: 's8', ticket: 'BSP-2026-00008', clienteId: 'c8',
      categoria: 'Cobro indebido',
      descripcion: 'Me cobraron comisión de manejo de cuenta pese a cumplir el saldo mínimo requerido.',
      estado: 'Resuelto', prioridad: 'Media', complejidad: 'Baja', agente: A[2],
      creadoOffset: -30,
      historial: [
        { estado: 'Recibido', offset: -30 },
        { estado: 'En revisión', offset: -29, autor: A[2] },
        { estado: 'En proceso', offset: -27, autor: A[2] },
        { estado: 'Resuelto', offset: -20, autor: A[2], nota: 'Comisión reembolsada, resuelto fuera del plazo estimado por alta demanda.' },
      ],
    }),
    buildSolicitud({
      id: 's9', ticket: 'BSP-2026-00009', clienteId: 'c1',
      categoria: 'Banca en línea / App',
      descripcion: 'La app no me permite generar el estado de cuenta en PDF desde hace una semana.',
      estado: 'En revisión', prioridad: 'Baja', complejidad: 'Media', agente: A[3],
      creadoOffset: -12,
      historial: [
        { estado: 'Recibido', offset: -12 },
        { estado: 'En revisión', offset: -10, autor: A[3] },
      ],
    }),
    buildSolicitud({
      id: 's10', ticket: 'BSP-2026-00010', clienteId: 'c2',
      categoria: 'Transferencias y pagos',
      descripcion: 'Pago de servicio público duplicado por fallo en la plataforma web.',
      estado: 'Resuelto', prioridad: 'Media', complejidad: 'Media', agente: A[0],
      creadoOffset: -15,
      historial: [
        { estado: 'Recibido', offset: -15 },
        { estado: 'En revisión', offset: -14, autor: A[0] },
        { estado: 'En proceso', offset: -12, autor: A[0] },
        { estado: 'Resuelto', offset: -9, autor: A[0], nota: 'Reembolso aplicado en el siguiente ciclo de facturación.' },
      ],
    }),
    buildSolicitud({
      id: 's11', ticket: 'BSP-2026-00011', clienteId: 'c3',
      categoria: 'Préstamos y créditos',
      descripcion: 'Solicito constancia de saldo de préstamo hipotecario para trámite legal.',
      estado: 'Recibido', prioridad: 'Baja', complejidad: 'Baja',
      creadoOffset: -2,
      historial: [{ estado: 'Recibido', offset: -2 }],
    }),
    buildSolicitud({
      id: 's12', ticket: 'BSP-2026-00012', clienteId: 'c4',
      categoria: 'Atención al cliente',
      descripcion: 'Tiempo de espera excesivo en call center, más de 40 minutos sin respuesta.',
      estado: 'En proceso', prioridad: 'Media', complejidad: 'Baja', agente: A[1],
      creadoOffset: -8,
      historial: [
        { estado: 'Recibido', offset: -8 },
        { estado: 'En revisión', offset: -7, autor: A[1] },
        { estado: 'En proceso', offset: -5, autor: A[1] },
      ],
    }),
    buildSolicitud({
      id: 's13', ticket: 'BSP-2026-00013', clienteId: 'c5',
      categoria: 'Tarjeta de crédito/débito',
      descripcion: 'Solicito aumento de línea de crédito y no he recibido respuesta desde hace 10 días.',
      estado: 'En revisión', prioridad: 'Baja', complejidad: 'Media', agente: A[2],
      creadoOffset: -11,
      historial: [
        { estado: 'Recibido', offset: -11 },
        { estado: 'En revisión', offset: -9, autor: A[2] },
      ],
    }),
    buildSolicitud({
      id: 's14', ticket: 'BSP-2026-00014', clienteId: 'c6',
      categoria: 'Cobro indebido',
      descripcion: 'Penalidad por pago tardío aplicada pese a haber pagado dentro de la fecha límite.',
      estado: 'En proceso', prioridad: 'Alta', complejidad: 'Media', agente: A[3],
      creadoOffset: -5,
      historial: [
        { estado: 'Recibido', offset: -5 },
        { estado: 'En revisión', offset: -5, autor: A[3] },
        { estado: 'En proceso', offset: -3, autor: A[3], nota: 'Verificando comprobante de pago con el cliente.' },
      ],
      archivoAdjunto: { nombre: 'comprobante_pago.jpg', tipo: 'image/jpeg' },
    }),
    buildSolicitud({
      id: 's15', ticket: 'BSP-2026-00015', clienteId: 'c7',
      categoria: 'Banca en línea / App',
      descripcion: 'Notificaciones push de la app duplicadas por cada transacción realizada.',
      estado: 'Resuelto', prioridad: 'Baja', complejidad: 'Baja', agente: A[0],
      creadoOffset: -20,
      historial: [
        { estado: 'Recibido', offset: -20 },
        { estado: 'En revisión', offset: -18, autor: A[0] },
        { estado: 'En proceso', offset: -15, autor: A[0] },
        { estado: 'Resuelto', offset: -10, autor: A[0], nota: 'Corrección aplicada en la versión más reciente de la app.' },
      ],
    }),
    buildSolicitud({
      id: 's16', ticket: 'BSP-2026-00016', clienteId: 'c8',
      categoria: 'Transferencias y pagos',
      descripcion: 'Comisión por transferencia internacional más alta de lo informado en agencia.',
      estado: 'Recibido', prioridad: 'Media', complejidad: 'Media',
      creadoOffset: -1,
      historial: [{ estado: 'Recibido', offset: -1 }],
    }),
    buildSolicitud({
      id: 's17', ticket: 'BSP-2026-00017', clienteId: 'c1',
      categoria: 'Otro',
      descripcion: 'Solicito actualización de datos de contacto y dirección registrada en el banco.',
      estado: 'Resuelto', prioridad: 'Baja', complejidad: 'Baja', agente: A[1],
      creadoOffset: -14,
      historial: [
        { estado: 'Recibido', offset: -14 },
        { estado: 'En revisión', offset: -13, autor: A[1] },
        { estado: 'En proceso', offset: -12, autor: A[1] },
        { estado: 'Resuelto', offset: -11, autor: A[1], nota: 'Datos actualizados en el sistema core.' },
      ],
    }),
    buildSolicitud({
      id: 's18', ticket: 'BSP-2026-00018', clienteId: 'c2',
      categoria: 'Préstamos y créditos',
      descripcion: 'Rechazo de solicitud de crédito sin justificación clara del motivo.',
      estado: 'En revisión', prioridad: 'Alta', complejidad: 'Alta', agente: A[2],
      creadoOffset: -7,
      historial: [
        { estado: 'Recibido', offset: -7 },
        { estado: 'En revisión', offset: -6, autor: A[2] },
      ],
    }),
    buildSolicitud({
      id: 's19', ticket: 'BSP-2026-00019', clienteId: 'c3',
      categoria: 'Atención al cliente',
      descripcion: 'Ejecutivo de cuenta no responde correos desde hace más de una semana.',
      estado: 'En proceso', prioridad: 'Baja', complejidad: 'Baja', agente: A[3],
      creadoOffset: -10,
      historial: [
        { estado: 'Recibido', offset: -10 },
        { estado: 'En revisión', offset: -9, autor: A[3] },
        { estado: 'En proceso', offset: -7, autor: A[3] },
      ],
    }),
    buildSolicitud({
      id: 's20', ticket: 'BSP-2026-00020', clienteId: 'c4',
      categoria: 'Tarjeta de crédito/débito',
      descripcion: 'Solicito cancelación de tarjeta de crédito adicional y confirmación por escrito.',
      estado: 'Recibido', prioridad: 'Media', complejidad: 'Baja',
      creadoOffset: 0,
      historial: [{ estado: 'Recibido', offset: 0 }],
    }),
  ]
}
