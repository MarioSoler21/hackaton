import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CLIENTES_DEMO } from '../data/seed'
import { AGENTES_DEMO, BANCO_NOMBRE, DEMO_PASSWORD, PLATAFORMA_NOMBRE } from '../data/constants'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const { loginCliente, loginAgente } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('cliente')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})
  const errorSummaryRef = useRef(null)

  useEffect(() => {
    document.title = `Iniciar sesión · ${PLATAFORMA_NOMBRE}`
  }, [])

  useEffect(() => {
    if (Object.keys(errores).length > 0) errorSummaryRef.current?.focus()
  }, [errores])

  function validar() {
    const nuevosErrores = {}
    if (!nombre.trim()) nuevosErrores.nombre = 'Ingresa tu nombre completo.'
    if (role === 'cliente') {
      if (!email.trim()) nuevosErrores.email = 'Ingresa tu correo electrónico.'
      else if (!EMAIL_PATTERN.test(email)) nuevosErrores.email = 'Ingresa un correo electrónico válido.'
    }
    if (!password) nuevosErrores.password = 'Ingresa la contraseña de demostración.'
    else if (password !== DEMO_PASSWORD)
      nuevosErrores.password = 'Contraseña incorrecta. Usa la contraseña de demostración indicada abajo.'
    return nuevosErrores
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    if (role === 'cliente') {
      loginCliente({ nombre, email })
      navigate('/cliente')
    } else {
      loginAgente({ nombre })
      navigate('/agente')
    }
  }

  function accesoRapidoCliente(cliente) {
    loginCliente({ nombre: cliente.nombre, email: cliente.email })
    navigate('/cliente')
  }

  function accesoRapidoAgente(nombreAgente) {
    loginAgente({ nombre: nombreAgente })
    navigate('/agente')
  }

  return (
    <main className="flex min-h-full items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-navy-900 p-8 text-white md:flex">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-brand text-base font-extrabold text-navy-950">
              BSP
            </span>
            <p className="mt-6 text-2xl font-bold leading-snug">
              Gestiona tus solicitudes y reclamos con total visibilidad.
            </p>
            <p className="mt-3 text-sm text-white/70">
              Crea tu caso, recibe un número de ticket al instante y da seguimiento al
              estado de tu solicitud sin necesidad de llamar al banco.
            </p>
          </div>
          <p className="text-xs text-white/50">{BANCO_NOMBRE}</p>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-xl font-bold text-navy-950">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-slate-600">
            Prototipo de demostración. Usa la contraseña indicada abajo con cualquier
            nombre (y correo, si entras como cliente).
          </p>
          <p className="mt-2 rounded-md bg-teal-brand-light px-3 py-2 text-sm text-teal-text">
            Contraseña de demostración: <strong className="font-mono">{DEMO_PASSWORD}</strong>
          </p>

          {Object.keys(errores).length > 0 && (
            <div
              ref={errorSummaryRef}
              tabIndex={-1}
              role="alert"
              className="mt-4 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900 outline-none"
            >
              <p className="font-semibold">Revisa lo siguiente antes de continuar:</p>
              <ul className="mt-1 list-inside list-disc">
                {Object.values(errores).map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend className="text-sm font-semibold text-navy-950">Ingresar como</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
                {[
                  { value: 'cliente', label: 'Cliente' },
                  { value: 'agente', label: 'Agente / Analista' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition ${
                      role === opt.value
                        ? 'bg-navy-900 text-white shadow'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={role === opt.value}
                      onChange={() => {
                        setRole(opt.value)
                        setErrores((prev) => {
                          const { email: _omit, ...rest } = prev
                          return opt.value === 'cliente' ? prev : rest
                        })
                      }}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-navy-950">
                Nombre completo <span aria-hidden="true">*</span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                aria-invalid={Boolean(errores.nombre)}
                aria-describedby={errores.nombre ? 'nombre-error' : undefined}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-navy-600 focus:ring-navy-600"
              />
              {errores.nombre && (
                <p id="nombre-error" className="mt-1 text-sm text-rose-700">
                  {errores.nombre}
                </p>
              )}
            </div>

            {role === 'cliente' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-navy-950">
                  Correo electrónico <span aria-hidden="true">*</span>
                  <span className="sr-only"> (obligatorio)</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(errores.email)}
                  aria-describedby={errores.email ? 'email-error' : undefined}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-navy-600 focus:ring-navy-600"
                />
                {errores.email && (
                  <p id="email-error" className="mt-1 text-sm text-rose-700">
                    {errores.email}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-950">
                Contraseña <span aria-hidden="true">*</span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errores.password)}
                aria-describedby={errores.password ? 'password-error' : undefined}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-navy-600 focus:ring-navy-600"
              />
              {errores.password && (
                <p id="password-error" className="mt-1 text-sm text-rose-700">
                  {errores.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-teal-text px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-text-hover focus:outline-none"
            >
              {role === 'cliente' ? 'Entrar como cliente' : 'Entrar como agente'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Acceso rápido de demostración
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => accesoRapidoCliente(CLIENTES_DEMO[0])}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Entrar como {CLIENTES_DEMO[0].nombre.split(' ')[0]} (cliente)
              </button>
              <button
                type="button"
                onClick={() => accesoRapidoAgente(AGENTES_DEMO[0])}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Entrar como {AGENTES_DEMO[0]} (agente)
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
