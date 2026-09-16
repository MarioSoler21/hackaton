import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CLIENTES_DEMO } from '../data/seed'

const AUTH_KEY = 'bsp_auth'
const AuthContext = createContext(null)

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredAuth)

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    else localStorage.removeItem(AUTH_KEY)
  }, [user])

  const value = useMemo(
    () => ({
      user,
      loginCliente({ nombre, email }) {
        const existente = CLIENTES_DEMO.find(
          (c) => c.email.toLowerCase() === email.toLowerCase(),
        )
        const clienteId = existente ? existente.id : `nuevo-${Date.now()}`
        setUser({
          role: 'cliente',
          clienteId,
          nombre: existente ? existente.nombre : nombre,
          email,
        })
      },
      loginAgente({ nombre }) {
        setUser({ role: 'agente', nombre })
      },
      logout() {
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
