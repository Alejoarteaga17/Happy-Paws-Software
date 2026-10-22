'use client';

import { FormEvent, useEffect, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import { createOwner, deleteOwner, getOwners, updateOwner } from '../../services/owner-service';
import { Owner, OwnerInput } from '../../types/owner';
import { RoleView } from '../../context/auth-context';

export default function OwnersPage() {
  return (
    <RestrictedView permission="manage_owners">
      <OwnersTable />
    </RestrictedView>
  );
}

function OwnersTable() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<OwnerInput>({ fullName: '', phone: '', email: '', address: '' });
  const [error, setError] = useState<string | null>(null);
  const load = () =>
    getOwners()
      .then(setOwners)
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'No se pudieron cargar los propietarios'));
  useEffect(() => {
    void load();
  }, []);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (editingId === null) await createOwner(form);
      else await updateOwner(editingId, form);
      setForm({ fullName: '', phone: '', email: '', address: '' });
      setEditingId(null);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo guardar el propietario');
    }
  };
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
          <form className="appointment-form" onSubmit={submit}>
            <p className="eyebrow">{editingId === null ? 'Nuevo propietario' : `Editando propietario #${editingId}`}</p>
            <label>
              Nombre
              <input
                required
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
              />
            </label>
            <label>
              Teléfono
              <input
                required
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </label>
            <label>
              Correo
              <input
                type="email"
                value={form.email ?? ''}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <label>
              Dirección
              <input
                value={form.address ?? ''}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
              />
            </label>
            <button className="primary-button">{editingId === null ? 'Crear propietario' : 'Guardar cambios'}</button>
          </form>
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
                  <td>
                    <button
                      className="text-button"
                      onClick={() => {
                        setEditingId(owner.id);
                        setForm({
                          fullName: owner.fullName,
                          phone: owner.phone,
                          email: owner.email ?? '',
                          address: owner.address ?? '',
                        });
                      }}
                    >
                      Editar
                    </button>
                    <RoleView permission="manage_users">
                      <button
                        className="text-button danger-button"
                        onClick={() =>
                          void deleteOwner(owner.id)
                            .then(load)
                            .catch((reason) =>
                              setError(reason instanceof Error ? reason.message : 'No se pudo eliminar'),
                            )
                        }
                      >
                        Eliminar
                      </button>
                    </RoleView>
                  </td>
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
