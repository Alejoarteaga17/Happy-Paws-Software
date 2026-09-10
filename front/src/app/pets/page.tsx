'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getOwners } from '../../services/owner-service';
import { createPet, getPets } from '../../services/pet-service';
import { Owner } from '../../types/owner';
import { Pet } from '../../types/pet';

const emptyForm = { ownerId: '', petTag: '', name: '', species: '', breed: '', birthDate: '', weight: '' };

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadPets = async () => {
    try {
      const [loadedPets, loadedOwners] = await Promise.all([getPets(), getOwners()]);
      setPets(loadedPets); setOwners(loadedOwners); setMessage(null);
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudieron cargar las mascotas'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void loadPets(); }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setMessage(null);
    try {
      await createPet({ ownerId: Number(form.ownerId), petTag: form.petTag, name: form.name, species: form.species, breed: form.breed || undefined, birthDate: form.birthDate || undefined, weight: form.weight ? Number(form.weight) : undefined });
      setForm(emptyForm); setMessage('La mascota fue registrada correctamente.'); await loadPets();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo registrar la mascota'); }
    finally { setSaving(false); }
  };

  return <main className="appointment-shell">
    <header className="appointment-header"><div><p className="eyebrow">RF-01 · Pacientes</p><h1>Registro de mascotas</h1><p>Vincula cada paciente con su propietario para mantener su historia clínica organizada.</p></div><a className="back-link" href="/">Volver al panel</a></header>
    <section className="appointment-layout">
      <form className="appointment-form" onSubmit={submit}><p className="eyebrow">Nueva mascota</p><h2>Registrar paciente</h2>
        <label>Propietario<select required value={form.ownerId} onChange={(event) => setForm({ ...form, ownerId: event.target.value })}><option value="">Selecciona un propietario</option>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.fullName} · {owner.phone}</option>)}</select></label>
        <label>Pet tag<input required value={form.petTag} onChange={(event) => setForm({ ...form, petTag: event.target.value })} placeholder="Ej. HP-0005" /></label>
        <label>Nombre<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Coco" /></label>
        <label>Especie<input required value={form.species} onChange={(event) => setForm({ ...form, species: event.target.value })} placeholder="Perro o gato" /></label>
        <label>Raza<input value={form.breed} onChange={(event) => setForm({ ...form, breed: event.target.value })} placeholder="Opcional" /></label>
        <label>Fecha de nacimiento<input type="date" value={form.birthDate} onChange={(event) => setForm({ ...form, birthDate: event.target.value })} /></label>
        <label>Peso en kg<input min="0.01" step="0.01" type="number" value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} placeholder="Opcional" /></label>
        <button className="primary-button" disabled={saving}>{saving ? 'Guardando...' : 'Registrar mascota'}</button>
      </form>
      <section className="appointment-list"><div className="list-title"><div><p className="eyebrow">Pacientes</p><h2>Mascotas registradas</h2></div><span>{pets.length}</span></div>{message && <p className="notice">{message}</p>}{loading ? <p className="empty">Cargando mascotas...</p> : pets.length === 0 ? <p className="empty">No hay mascotas registradas.</p> : <ul>{pets.map((pet) => <li className="appointment-item" key={pet.id}><div><strong>{pet.name}</strong><span>{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</span><span>Pet tag: {pet.petTag} · Propietario: {pet.ownerName}</span></div><span>{pet.weight ? `${pet.weight} kg` : 'Peso no registrado'}</span></li>)}</ul>}</section>
    </section>
  </main>;
}