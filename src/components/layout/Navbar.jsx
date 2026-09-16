import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BANCO_NOMBRE, PLATAFORMA_NOMBRE } from '../../data/constants'
import { IconLogout, IconUser } from '../common/Icons'
import { NotificationsMenu } from './NotificationsMenu'

const linkBase =
  'rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white'
const linkActive = 'bg-white/15 text-white'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="bg-navy-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-brand text-sm font-extrabold text-navy-950"
          >
            BSP
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold text-white">{PLATAFORMA_NOMBRE}</p>
            <p className="hidden text-xs text-white/60 sm:block">{BANCO_NOMBRE}</p>
          </div>
        </div>

        <nav aria-label="Navegación principal" className="flex flex-1 justify-center gap-1">
          {user.role === 'cliente' ? (
            <>
              <NavLink
                to="/cliente"
                end
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}
              >
                Mis solicitudes
              </NavLink>
              <NavLink
                to="/cliente/nueva"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}
              >
                Nueva solicitud
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/agente"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}
            >
              Panel de solicitudes
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {user.role === 'cliente' && <NotificationsMenu clienteId={user.clienteId} />}
          <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white sm:flex">
            <IconUser width={16} height={16} />
            {user.nombre} · {user.role === 'cliente' ? 'Cliente' : 'Agente'}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          >
            <IconLogout width={18} height={18} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
