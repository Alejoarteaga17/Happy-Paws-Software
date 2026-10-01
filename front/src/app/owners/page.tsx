'use client';

import { useEffect, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import { getOwners } from '../../services/owner-service';
import { Owner } from '../../types/owner';

export default function OwnersPage() {
  return (
    <RestrictedView permission="manage_pets">
      <OwnersTable />
    </RestrictedView>
  );
}

function OwnersTable() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getOwners()
      .then(setOwners)
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'No se pudieron cargar los propietarios'));
  }, []);
  return (
    <main className="summary-page">
      <AppHeader />
      <section className="summary-content">
        <header className="summary-hero">
          <div>
            <p className="eyebrow">Directorio</p>
            <h1>Propietarios</h1>
            <p className="summary-subtitle">Consulta los contactos vinculados a los pacientes.</p>
          </div>
        </header>
        <section className="summary-panel table-panel">
          {error && <p className="form-error">{error}</p>}
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td>{owner.fullName}</td>
                  <td>{owner.phone}</td>
                  <td>{owner.email ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!owners.length && !error && <p className="empty">No hay propietarios disponibles.</p>}
        </section>
      </section>
    </main>
  );
}
