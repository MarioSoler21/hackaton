import { CATEGORIAS, ESTADOS, PRIORIDADES } from '../../data/constants'

export function FiltersBar({ filtros, onChange }) {
  function set(campo, valor) {
    onChange({ ...filtros, [campo]: valor })
  }

  return (
    <fieldset className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <legend className="px-1 text-sm font-semibold text-navy-950">Filtros</legend>

      <div>
        <label htmlFor="filtro-busqueda" className="block text-xs font-medium text-slate-600">
          Buscar
        </label>
        <input
          id="filtro-busqueda"
          type="search"
          value={filtros.busqueda}
          onChange={(e) => set('busqueda', e.target.value)}
          placeholder="Ticket, cliente o descripción"
          className="mt-1 w-56 max-w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
        />
      </div>

      <div>
        <label htmlFor="filtro-estado" className="block text-xs font-medium text-slate-600">
          Estado
        </label>
        <select
          id="filtro-estado"
          value={filtros.estado}
          onChange={(e) => set('estado', e.target.value)}
          className="mt-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
        >
          <option value="todos">Todos</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filtro-categoria" className="block text-xs font-medium text-slate-600">
          Categoría
        </label>
        <select
          id="filtro-categoria"
          value={filtros.categoria}
          onChange={(e) => set('categoria', e.target.value)}
          className="mt-1 max-w-[12rem] rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
        >
          <option value="todos">Todas</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filtro-prioridad" className="block text-xs font-medium text-slate-600">
          Prioridad
        </label>
        <select
          id="filtro-prioridad"
          value={filtros.prioridad}
          onChange={(e) => set('prioridad', e.target.value)}
          className="mt-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-navy-600 focus:ring-navy-600"
        >
          <option value="todos">Todas</option>
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {(filtros.busqueda || filtros.estado !== 'todos' || filtros.categoria !== 'todos' || filtros.prioridad !== 'todos') && (
        <button
          type="button"
          onClick={() => onChange({ busqueda: '', estado: 'todos', categoria: 'todos', prioridad: 'todos' })}
          className="rounded-md px-2.5 py-1.5 text-sm font-medium text-teal-text hover:text-teal-text-hover"
        >
          Limpiar filtros
        </button>
      )}
    </fieldset>
  )
}
