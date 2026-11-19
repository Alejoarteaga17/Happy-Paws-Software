'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { getOwners } from '../../services/owner-service';
import { createPet, deletePet, getPets, updatePet } from '../../services/pet-service';
import { Owner } from '../../types/owner';
import { Pet } from '../../types/pet';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import { RoleView, useAuth } from '../../context/auth-context';
import Link from 'next/link';

const emptyForm = { ownerId: '', petTag: '', name: '', species: '', breed: '', birthDate: '', weight: '', sex: '' };

export default function PetsPage() {
  const { can, loading } = useAuth();
  if (loading) return <main className="restricted-view">Cargando perfil...</main>;
  if (!can('manage_pets') && !can('edit_pets_basic'))
    return (
      <RestrictedView permission="manage_pets">
        <PetsManager />
      </RestrictedView>
    );
  return <PetsManager />;
}

function PetsManager() {
  const { can } = useAuth();
  const canManage = can('manage_pets');
  const [pets, setPets] = useState<Pet[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  const padTimeUnit = (value: number): string => String(value).padStart(2, '0');
  const today = new Date();
  const todayValue = `${today.getFullYear()}-${padTimeUnit(today.getMonth() + 1)}-${padTimeUnit(today.getDate())}`;

  const loadPets = useCallback(async () => {
    try {
      const loadedPets = await getPets();
      setPets(loadedPets);
      if (canManage) setOwners(await getOwners());
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudieron cargar las mascotas');
    } finally {
      setLoading(false);
    }
  }, [canManage]);

  useEffect(() => {
    void loadPets();
  }, [loadPets]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.birthDate && form.birthDate > todayValue) {
      setBirthDateError('La fecha de nacimiento no puede ser posterior al día de hoy.');
      setMessage('No se pudo registrar la mascota: corrige la fecha de nacimiento.');
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const basicFields = {
        name: form.name,
        species: form.species,
        breed: form.breed || undefined,
        birthDate: form.birthDate || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        sex: form.sex ? (form.sex as 'MALE' | 'FEMALE' | 'UNKNOWN') : undefined,
      };
      if (editingId === null) {
        await createPet({
          ownerId: Number(form.ownerId),
          petTag: form.petTag,
          ...basicFields,
        });
      } else {
        await updatePet(editingId, {
          ...basicFields,
          ...(canManage ? { ownerId: Number(form.ownerId), petTag: form.petTag } : {}),
        });
      }
      setForm(emptyForm);
      setEditingId(null);
      setMessage(
        editingId === null ? 'La mascota fue registrada correctamente.' : 'La mascota fue actualizada correctamente.',
      );
      await loadPets();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo registrar la mascota');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="appointment-shell">
      <AppHeader />
      <header className="appointment-header">
        <div>
          <h1>Registro de mascotas</h1>
          <p>Vincula cada paciente con su propietario para mantener su historia clínica organizada.</p>
        </div>
        <a className="back-link" href="/">
          Volver al panel
        </a>
      </header>
      <section className="appointment-layout">
        {(canManage || editingId !== null) && (
          <form className="appointment-form" onSubmit={submit}>
            <p className="eyebrow">{editingId === null ? 'Nueva mascota' : `Editando mascota #${editingId}`}</p>
            <h2>{editingId === null ? 'Registrar paciente' : 'Actualizar paciente'}</h2>
            <label>
              Propietario
              <div className="pet-owner-selector">
                <select
                  required
                  value={form.ownerId}
                  disabled={!canManage}
                  onChange={(event) => setForm({ ...form, ownerId: event.target.value })}
                >
                  <option value="">Selecciona un propietario</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.fullName} · {owner.phone}
                    </option>
                  ))}
                </select>
                {canManage && (
                  <Link className="secondary-button pet-create-owner" href="/owners">
                    Crear propietario
                  </Link>
                )}
              </div>
            </label>
            <label>
              Pet tag
              <input
                required
                value={form.petTag}
                disabled={!canManage}
                onChange={(event) => setForm({ ...form, petTag: event.target.value })}
                placeholder="Ej. HP-0005"
              />
            </label>
            <label>
              Nombre
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Ej. Coco"
              />
            </label>
            <label>
              Especie
              <select
                required
                value={form.species}
                onChange={(event) => setForm({ ...form, species: event.target.value })}
              >
                <option value="">Selecciona una especie</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Conejo">Conejo</option>
                <option value="Hámster">Hámster</option>
                <option value="Otra">Otra</option>
              </select>
            </label>
            <label>
              Raza
              <input
                value={form.breed}
                onChange={(event) => setForm({ ...form, breed: event.target.value })}
                placeholder="Opcional"
              />
            </label>
            <label>
              Fecha de nacimiento
              {birthDateError && (
                <span className="field-error" role="alert">
                  {birthDateError}
                </span>
              )}
              <input
                type="date"
                max={todayValue}
                value={form.birthDate}
                aria-invalid={Boolean(birthDateError)}
                onChange={(event) => {
                  const birthDate = event.target.value;
                  setForm({ ...form, birthDate });
                  setBirthDateError(
                    birthDate > todayValue ? 'La fecha de nacimiento no puede ser posterior al día de hoy.' : null,
                  );
                }}
              />
            </label>
            <label>
              Sexo
              <select value={form.sex} onChange={(event) => setForm({ ...form, sex: event.target.value })}>
                <option value="">No especificado</option>
                <option value="MALE">Macho</option>
                <option value="FEMALE">Hembra</option>
                <option value="UNKNOWN">Desconocido</option>
              </select>
            </label>
            <label>
              Peso en kg
              <input
                min="0.01"
                step="0.01"
                type="number"
                value={form.weight}
                onChange={(event) => setForm({ ...form, weight: event.target.value })}
                placeholder="Opcional"
              />
            </label>
            <button className="primary-button" disabled={saving}>
              {saving ? 'Guardando...' : editingId === null ? 'Registrar mascota' : 'Guardar cambios'}
            </button>
          </form>
        )}
        <section className="appointment-list">
          <div className="list-title">
            <div>
              <p className="eyebrow">Pacientes</p>
              <h2>Mascotas registradas</h2>
            </div>
            <span>{pets.length}</span>
          </div>
          {message && <p className="notice">{message}</p>}
          {loading ? (
            <p className="empty">Cargando mascotas...</p>
          ) : pets.length === 0 ? (
            <p className="empty">No hay mascotas registradas.</p>
          ) : (
            <ul>
              {pets.map((pet) => (
                <li className="appointment-item" key={pet.id}>
                  <div>
                    <strong>{pet.name}</strong>
                    <span>
                      {pet.species}
                      {pet.sex
                        ? ` · ${pet.sex === 'MALE' ? 'Macho' : pet.sex === 'FEMALE' ? 'Hembra' : 'Desconocido'}`
                        : ''}
                      {pet.breed ? ` · ${pet.breed}` : ''}
                    </span>
                    <span>
                      Pet tag: {pet.petTag} · Propietario: {pet.ownerName}
                    </span>
                  </div>
                  <div className="appointment-actions">
                    <button
                      className="text-button"
                      onClick={() => {
                        setEditingId(pet.id);
                        setForm({
                          ownerId: String(pet.ownerId),
                          petTag: pet.petTag,
                          name: pet.name,
                          species: pet.species,
                          breed: pet.breed ?? '',
                          birthDate: pet.birthDate ?? '',
                          weight: pet.weight ? String(pet.weight) : '',
                          sex: pet.sex ?? '',
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Editar
                    </button>
                    <RoleView permission="manage_users">
                      <button
                        className="text-button danger-button"
                        onClick={() =>
                          void deletePet(pet.id)
                            .then(loadPets)
                            .catch((reason) =>
                              setMessage(reason instanceof Error ? reason.message : 'No se pudo eliminar la mascota'),
                            )
                        }
                      >
                        Eliminar
                      </button>
                    </RoleView>
                    <span>{pet.weight ? `${pet.weight} kg` : 'Peso no registrado'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
