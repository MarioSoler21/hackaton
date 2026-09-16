# BSP Conecta — Gestión de Solicitudes y Reclamos

Prototipo funcional (MVP) para el caso de estudio de hackathon del **Banco de San
Pedro Sula**: una plataforma web integrada para registrar, clasificar, priorizar
y dar seguimiento a solicitudes y reclamos de clientes.

No requiere backend, base de datos ni autenticación real: los datos viven en
`localStorage` del navegador y se precargan con 20 solicitudes de ejemplo.

## Cómo iniciarlo

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

Para una build de producción / despliegue en Vercel:

```bash
npm run build
npm run preview
```

## Acceso de demostración

La pantalla de inicio de sesión usa una contraseña fija de demostración (no hay
autenticación real ni backend):

```
Contraseña: BSP2026
```

Puedes:

- Elegir el rol **Cliente** o **Agente/Analista**, escribir cualquier nombre (y
  correo, si eres cliente) y esa contraseña, o
- Usar los botones de **"Acceso rápido de demostración"** para entrar
  inmediatamente con un cliente o agente de ejemplo (sin pedir contraseña).

Si inicias sesión con el correo de un cliente ya existente en los datos de
prueba (ver `src/data/seed.js`), verás sus solicitudes previas. Con un correo
nuevo, entras como cliente nuevo sin solicitudes.

## Despliegue en Vercel

El repo incluye `vercel.json` con la reescritura necesaria para que las rutas
de React Router (`/cliente`, `/agente`, `/cliente/solicitud/:id`, etc.) no den
404 al recargar o compartir el enlace directo. Para desplegar:

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Vite** (detectado automáticamente). Build command
   `npm run build`, output directory `dist` (valores por defecto).
3. Despliega — no se requieren variables de entorno.

## Pantallas incluidas

**Cliente**
- Inicio de sesión simulado (`/`)
- Mis solicitudes: listado con estado, fecha estimada y filtros (`/cliente`)
- Nueva solicitud: categoría, descripción y adjunto, con número de ticket
  inmediato al enviar (`/cliente/nueva`)
- Seguimiento de una solicitud: línea de tiempo tipo tracking
  (`/cliente/solicitud/:id`)
- Notificaciones (campana en la barra superior) cuando cambia el estado de un caso

**Agente / Analista**
- Panel de solicitudes con pestañas (`/agente`):
  - **Solicitudes**: tabla filtrable por estado, categoría y prioridad, con
    alerta de casos atrasados
  - **Indicadores (KPIs)**: total de solicitudes, tiempo promedio de
    resolución, % resueltas dentro del plazo, solicitudes por categoría y
    casos atrasados / próximos a vencer
- Panel de detalle (modal) por solicitud: clasificar por prioridad y
  complejidad, asignar agente, cambiar estado y dejar notas internas

## Notas técnicas

- React + Vite + React Router + Tailwind CSS v4.
- Estado global en `AuthContext` (sesión simulada) y `AppDataContext`
  (solicitudes y notificaciones), persistidos en `localStorage`.
- Si abres una pestaña como cliente y otra como agente, los cambios de estado
  se sincronizan entre pestañas (evento `storage`), simulando actualización en
  tiempo real.
- Botón **"Reiniciar datos demo"** en el panel del agente para regenerar el
  set de datos de prueba.
- Construido siguiendo pautas de accesibilidad WCAG 2.2 AA (landmarks,
  formularios con `label`/errores anunciados, tabla con encabezados
  semánticos, panel de detalle con `<dialog>` nativo, live regions para
  cambios de estado, contraste AA en la paleta azul/turquesa).
