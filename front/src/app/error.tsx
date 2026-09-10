'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-shell">
      <section className="error-panel" aria-labelledby="error-title">
        <div className="not-found-mark material-symbols-outlined" aria-hidden="true">pets</div>
        <p className="not-found-code">Algo salió mal</p>
        <h1 id="error-title">La clínica necesita un segundo intento</h1>
        <p className="error-copy">
          Ocurrió un problema inesperado al cargar esta pantalla. Puedes intentarlo de nuevo o volver al panel principal.
        </p>
        <div className="not-found-actions">
          <button className="primary-button" type="button" onClick={() => reset()}>Intentar de nuevo</button>
          <a className="secondary-button" href="/">Volver al panel</a>
        </div>
      </section>
    </main>
  );
}
