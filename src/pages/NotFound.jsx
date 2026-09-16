import { Link } from 'react-router-dom'
import { PageHeading } from '../components/common/PageHeading'

export function NotFound() {
  return (
    <div>
      <PageHeading title="Página no encontrada" />
      <p className="text-slate-600">
        La página que buscas no existe.{' '}
        <Link to="/" className="font-semibold text-teal-text hover:text-teal-text-hover">
          Volver al inicio
        </Link>
        .
      </p>
    </div>
  )
}
