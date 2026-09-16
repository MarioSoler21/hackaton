import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { useAnnouncer } from '../context/AnnouncerContext'
import { PageHeading } from '../components/common/PageHeading'
import { CATEGORIAS } from '../data/constants'
import { formatDate } from '../utils/dates'
import { IconCheckCircle, IconFile, IconUpload, IconX } from '../components/common/Icons'

const MAX_ARCHIVO_BYTES = 5 * 1024 * 1024
const TIPOS_ACEPTADOS = ['application/pdf', 'image/png', 'image/jpeg']

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ClientNewRequest() {
  const { user } = useAuth()
  const { crearSolicitud } = useAppData()
  const announce = useAnnouncer()

  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [errores, setErrores] = useState({})
  const [solicitudCreada, setSolicitudCreada] = useState(null)

  const errorSummaryRef = useRef(null)
  const confirmacionRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (Object.keys(errores).length > 0) errorSummaryRef.current?.focus()
  }, [errores])

  useEffect(() => {
    if (solicitudCreada) confirmacionRef.current?.focus()
  }, [solicitudCreada])

  function handleArchivoChange(e) {
    const file = e.target.files?.[0]
    if (!file) {
      setArchivo(null)
      return
    }
    if (!TIPOS_ACEPTADOS.includes(file.type)) {
      setErrores((prev) => ({ ...prev, archivo: 'Formato no permitido. Adjunta un PDF, JPG o PNG.' }))
      e.target.value = ''
      return
    }
    if (file.size > MAX_ARCHIVO_BYTES) {
      setErrores((prev) => ({ ...prev, archivo: 'El archivo supera el tamaño máximo de 5 MB.' }))
      e.target.value = ''
      return
    }
    setErrores((prev) => {
      const { archivo: _omit, ...rest } = prev
      return rest
    })
    setArchivo({ nombre: file.name, tipo: file.type, tamano: file.size })
  }

  function quitarArchivo() {
    setArchivo(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    announce('Archivo adjunto eliminado.')
  }

  function validar() {
    const nuevosErrores = {}
    if (!categoria) nuevosErrores.categoria = 'Selecciona una categoría para tu solicitud.'
    if (!descripcion.trim()) nuevosErrores.descripcion = 'Describe tu solicitud o reclamo.'
    else if (descripcion.trim().length < 15)
      nuevosErrores.descripcion = 'Agrega un poco más de detalle (mínimo 15 caracteres).'
    return nuevosErrores
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nuevosErrores = validar()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }
    const nueva = crearSolicitud({
      clienteId: user.clienteId,
      clienteNombre: user.nombre,
      clienteEmail: user.email,
      categoria,
      descripcion: descripcion.trim(),
      archivoAdjunto: archivo,
    })
    setSolicitudCreada(nueva)
    setErrores({})
  }

  function crearOtra() {
    setSolicitudCreada(null)
    setCategoria('')
    setDescripcion('')
    setArchivo(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (solicitudCreada) {
    return (
      <div>
        <PageHeading title="Solicitud enviada" />
        <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
          <IconCheckCircle width={40} height={40} className="mx-auto text-emerald-700" aria-hidden="true" />
          <h2 ref={confirmacionRef} tabIndex={-1} className="mt-3 text-lg font-bold text-emerald-900 outline-none">
            ¡Tu solicitud fue registrada con éxito!
          </h2>
          <p className="mt-2 text-sm text-emerald-800">Tu número de ticket es:</p>
          <p className="mt-1 font-mono text-2xl font-extrabold tracking-wide text-emerald-900">
            {solicitudCreada.ticket}
          </p>
          <p className="mt-3 text-sm text-emerald-800">
            Fecha estimada de resolución: <strong>{formatDate(solicitudCreada.fechaEstimada)}</strong>
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to={`/cliente/solicitud/${solicitudCreada.id}`}
              className="rounded-md bg-teal-text px-4 py-2 text-sm font-semibold text-white hover:bg-teal-text-hover"
            >
              Ver seguimiento
            </Link>
            <button
              type="button"
              onClick={crearOtra}
              className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
            >
              Crear otra solicitud
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeading title="Nueva solicitud" subtitle="Cuéntanos qué sucedió y te asignaremos un número de ticket al instante." />

      {Object.keys(errores).length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-4 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900 outline-none"
        >
          <p className="font-semibold">Revisa lo siguiente antes de enviar tu solicitud:</p>
          <ul className="mt-1 list-inside list-disc">
            {Object.values(errores).map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <label htmlFor="categoria" className="block text-sm font-semibold text-navy-950">
            Categoría <span aria-hidden="true">*</span>
            <span className="sr-only"> (obligatorio)</span>
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            aria-invalid={Boolean(errores.categoria)}
            aria-describedby={errores.categoria ? 'categoria-error' : undefined}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-navy-600 focus:ring-navy-600"
          >
            <option value="">Selecciona una categoría…</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errores.categoria && (
            <p id="categoria-error" className="mt-1 text-sm text-rose-700">
              {errores.categoria}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-semibold text-navy-950">
            Descripción <span aria-hidden="true">*</span>
            <span className="sr-only"> (obligatorio)</span>
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={5}
            aria-invalid={Boolean(errores.descripcion)}
            aria-describedby={errores.descripcion ? 'descripcion-error descripcion-ayuda' : 'descripcion-ayuda'}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-navy-600 focus:ring-navy-600"
          />
          <p id="descripcion-ayuda" className="mt-1 text-xs text-slate-500">
            Incluye fechas, montos u otros datos que ayuden a entender tu caso.
          </p>
          {errores.descripcion && (
            <p id="descripcion-error" className="mt-1 text-sm text-rose-700">
              {errores.descripcion}
            </p>
          )}
        </div>

        <div>
          <span className="block text-sm font-semibold text-navy-950" id="archivo-label">
            Adjuntar evidencia (opcional)
          </span>
          <label
            htmlFor="archivo"
            className="mt-1 flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 px-4 py-6 text-center hover:border-navy-500"
          >
            <IconUpload width={22} height={22} className="text-slate-400" />
            <span className="text-sm font-medium text-navy-800">Selecciona un archivo</span>
            <span id="archivo-ayuda" className="text-xs text-slate-500">
              Formatos permitidos: PDF, JPG o PNG. Tamaño máximo 5 MB.
            </span>
            <input
              ref={fileInputRef}
              id="archivo"
              name="archivo"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleArchivoChange}
              aria-describedby={errores.archivo ? 'archivo-error archivo-ayuda' : 'archivo-ayuda'}
              className="sr-only"
            />
          </label>
          {errores.archivo && (
            <p id="archivo-error" role="alert" className="mt-1 text-sm text-rose-700">
              {errores.archivo}
            </p>
          )}

          {archivo && (
            <ul className="mt-2">
              <li className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <span className="flex min-w-0 items-center gap-2 text-slate-700">
                  <IconFile width={16} height={16} className="shrink-0 text-slate-500" />
                  <span className="truncate">{archivo.nombre}</span>
                  <span className="shrink-0 text-xs text-slate-500">({formatBytes(archivo.tamano)})</span>
                </span>
                <button
                  type="button"
                  onClick={quitarArchivo}
                  aria-label={`Eliminar archivo adjunto ${archivo.nombre}`}
                  className="shrink-0 rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                >
                  <IconX width={16} height={16} />
                </button>
              </li>
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Link
            to="/cliente"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="rounded-md bg-teal-text px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-text-hover"
          >
            Enviar solicitud
          </button>
        </div>
      </form>
    </div>
  )
}
