export const CATEGORIAS = [
  'Cobro indebido',
  'Tarjeta de crédito/débito',
  'Préstamos y créditos',
  'Banca en línea / App',
  'Transferencias y pagos',
  'Atención al cliente',
  'Otro',
]

export const ESTADOS = ['Recibido', 'En revisión', 'En proceso', 'Resuelto']

export const PRIORIDADES = ['Alta', 'Media', 'Baja']

export const COMPLEJIDADES = ['Alta', 'Media', 'Baja']

// Días hábiles estimados de resolución según prioridad, usados al crear
// una solicitud y cuando el agente reclasifica el caso.
export const DIAS_ESTIMADOS_POR_PRIORIDAD = {
  Alta: 3,
  Media: 7,
  Baja: 12,
}

export const AGENTES_DEMO = [
  'Ana Fuentes',
  'Carlos Mejía',
  'Daniela Reyes',
  'José Pineda',
]

export const BANCO_NOMBRE = 'Banco de San Pedro Sula'
export const PLATAFORMA_NOMBRE = 'BSP Conecta'

// Contraseña fija de demostración (prototipo sin autenticación real).
export const DEMO_PASSWORD = 'BSP2026'
