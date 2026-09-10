import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found-shell">
      <section className="not-found-panel" aria-labelledby="not-found-title">
        <div className="not-found-mark material-symbols-outlined" aria-hidden="true">pets</div>
        <p className="not-found-code">Error 404</p>
        <h1 id="not-found-title">Esta huella se perdió</h1>
        <p className="not-found-copy">
          La página que buscas no existe o ya fue movida. Regresa al panel para continuar cuidando a tus pacientes.
        </p>
        <div className="not-found-actions">
          <Link className="primary-button" href="/">Volver al panel</Link>
          <Link className="secondary-button" href="/vaccinations">Ver vacunaciones</Link>
        </div>
      </section>
    </main>
  );
}
