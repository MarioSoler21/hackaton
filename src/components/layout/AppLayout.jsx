import { Outlet } from 'react-router-dom'
import { SkipLink } from './SkipLink'
import { Navbar } from './Navbar'

export function AppLayout() {
  return (
    <div className="flex min-h-full flex-col">
      <SkipLink />
      <Navbar />
      <main id="contenido-principal" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none sm:px-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Prototipo de demostración — datos de prueba, sin conexión a sistemas reales del banco.
      </footer>
    </div>
  )
}
