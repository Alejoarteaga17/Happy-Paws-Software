'use client';

import { FormEvent, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import { searchRecords } from '../../services/search-service';
import { SearchResult } from '../../types/search';

export default function SearchPage() {
  return (
    <RestrictedView permission="search_records">
      <SearchView />
    </RestrictedView>
  );
}

function SearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResults([]);
    try {
      setResults(await searchRecords(query.trim()));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo buscar');
    }
  };

  return (
    <main className="summary-page">
      <AppHeader />
      <section className="summary-content">
        <header className="summary-hero">
          <div>
            <p className="eyebrow">Directorio</p>
            <h1>Búsqueda global</h1>
            <p className="summary-subtitle">Encuentra propietarios y mascotas por nombre, teléfono o identificador.</p>
          </div>
        </header>
        <section className="summary-panel table-panel">
          <form className="appointment-form" onSubmit={submit}>
            <label>
              Buscar
              <input
                required
                minLength={2}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nombre, teléfono o pet tag"
              />
            </label>
            <button className="primary-button" type="submit">
              Buscar
            </button>
          </form>
          {error && <p className="form-error">{error}</p>}
          {!error && query.length >= 2 && !results.length && <p className="empty">No se encontraron registros.</p>}
          {!!results.length && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Resultado</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={`${result.type}-${result.id}`}>
                    <td>{result.type === 'OWNER' ? 'Propietario' : 'Mascota'}</td>
                    <td>{result.title}</td>
                    <td>{result.subtitle || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </section>
    </main>
  );
}
