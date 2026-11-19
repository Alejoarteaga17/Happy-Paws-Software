'use client';

import { FormEvent, useEffect, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import { createOwner, getOwners, updateOwner, updateOwnerStatus } from '../../services/owner-service';
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
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'fullName' | 'phone' | 'email', string>>>({});

  const validateField = (field: 'fullName' | 'phone' | 'email', value: string): string | undefined => {
    if (field === 'fullName' && value.trim().length < 3) {
      return 'Ingresa un nombre de propietario con al menos 3 caracteres.';
    }
    if (field === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) {
        return 'Ingresa un teléfono válido entre 7 y 15 dígitos.';
      }
    }
    if (field === 'email' && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return 'Ingresa un correo válido, por ejemplo nombre@correo.com.';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const nextErrors = {
      fullName: validateField('fullName', form.fullName),
      phone: validateField('phone', form.phone),
      email: validateField('email', form.email ?? ''),
    };
    setFieldErrors(nextErrors);
    setError(null);
    setSuccess(null);
    return !nextErrors.fullName && !nextErrors.phone && !nextErrors.email;
  };

  const updateField = (field: 'fullName' | 'phone' | 'email', value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: validateField(field, value) }));
  };

  const load = () =>
    getOwners()
      .then(setOwners)
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'No se pudieron cargar los propietarios'));
  useEffect(() => {
    void load();
  }, []);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    const isEditing = editingId !== null;
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      if (isEditing) await updateOwner(editingId, form);
      else await createOwner(form);
      setForm({ fullName: '', phone: '', email: '', address: '' });
      setFieldErrors({});
      setEditingId(null);
      setSuccess(isEditing ? 'Propietario actualizado correctamente.' : 'Propietario creado correctamente.');
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : editingId === null
            ? 'No se pudo crear el propietario.'
            : 'No se pudo actualizar el propietario.',
      );
    } finally {
      setSaving(false);
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
                aria-invalid={Boolean(fieldErrors.fullName)}
                onChange={(event) => updateField('fullName', event.target.value)}
              />
              {fieldErrors.fullName && (
                <span className="field-error" role="alert">
                  {fieldErrors.fullName}
                </span>
              )}
            </label>
            <label>
              Teléfono
              <input
                required
                value={form.phone}
                aria-invalid={Boolean(fieldErrors.phone)}
                onChange={(event) => updateField('phone', event.target.value)}
              />
              {fieldErrors.phone && (
                <span className="field-error" role="alert">
                  {fieldErrors.phone}
                </span>
              )}
            </label>
            <label>
              Correo
              <input
                type="email"
                value={form.email ?? ''}
                aria-invalid={Boolean(fieldErrors.email)}
                onChange={(event) => updateField('email', event.target.value)}
              />
              {fieldErrors.email && (
                <span className="field-error" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </label>
            <label>
              Dirección
              <input
                value={form.address ?? ''}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
              />
            </label>
            <button className="primary-button" disabled={saving}>
              {saving
                ? editingId === null
                  ? 'Creando...'
                  : 'Guardando...'
                : editingId === null
                  ? 'Crear propietario'
                  : 'Guardar cambios'}
            </button>
          </form>
          {error && <p className="form-error">{error}</p>}
          {success && (
            <p className="form-success" role="status">
              {success}
            </p>
          )}
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
                          void updateOwnerStatus(owner.id, false)
                            .then(load)
                            .catch((reason) =>
                              setError(reason instanceof Error ? reason.message : 'No se pudo eliminar'),
                            )
                        }
                      >
                        Desactivar
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
