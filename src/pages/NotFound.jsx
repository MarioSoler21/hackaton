import { Link } from 'react-router-dom'
import { PageHeading } from '../components/common/PageHeading'

export function NotFound() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <PageHeading title="Página no encontrada" />
      <p className="text-slate-600">
        La página que buscas no existe.{' '}
        <Link to="/" className="font-semibold text-teal-text hover:text-teal-text-hover">
          Volver al inicio
        </Link>
        .
      </p>
    </main>
  )
}
