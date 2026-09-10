'use client';

import { FormEvent, useEffect, useState } from 'react';
import { cancelAppointment, createAppointment, getAppointments, updateAppointment } from '../../services/appointment-service';
import { getPets } from '../../services/pet-service';
import { Appointment, AppointmentInput, AppointmentStatus } from '../../types/appointment';
import { Pet } from '../../types/pet';

const labels: Record<AppointmentStatus, string> = { SCHEDULED: 'Agendada', COMPLETED: 'Completada', CANCELLED: 'Cancelada' };
const emptyForm: AppointmentInput = { petId: 0, scheduledAt: '', reason: '' };
const formatDate = (value: string) => new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [form, setForm] = useState<AppointmentInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      const [loadedAppointments, loadedPets] = await Promise.all([getAppointments(), getPets()]);
      setAppointments(loadedAppointments); setPets(loadedPets); setMessage(null);
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudieron cargar las citas'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void loadAppointments(); }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true);
    try {
      if (editingId === null) await createAppointment(form); else await updateAppointment(editingId, form);
      setForm(emptyForm); setEditingId(null); setMessage('La cita fue guardada correctamente.'); await loadAppointments();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo guardar la cita'); }
    finally { setSaving(false); }
  };

  const edit = (appointment: Appointment) => {
    setEditingId(appointment.id); setForm({ petId: appointment.petId, scheduledAt: appointment.scheduledAt.slice(0, 16), reason: appointment.reason });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancel = async (id: number) => {
    try { await cancelAppointment(id); setMessage('La cita fue cancelada.'); await loadAppointments(); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo cancelar la cita'); }
  };

  return <main className="appointment-shell">
    <header className="appointment-header"><div><p className="eyebrow">RF-04 · Agenda clínica</p><h1>Gestión de citas</h1><p>Organiza la atención veterinaria y conserva el historial de cada visita.</p></div><a className="back-link" href="/">Ver vacunaciones</a></header>
    <section className="appointment-layout">
      <form className="appointment-form" onSubmit={submit}><p className="eyebrow">{editingId === null ? 'Nueva cita' : `Editando cita #${editingId}`}</p><h2>{editingId === null ? 'Agendar atención' : 'Modificar cita'}</h2>
        <label>Mascota asociada<select required value={form.petId || ''} onChange={(event) => setForm({ ...form, petId: Number(event.target.value) })}><option value="">Selecciona una mascota</option>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name} · {pet.species} · {pet.petTag}</option>)}</select></label>
        <label>Fecha y hora<input type="datetime-local" required value={form.scheduledAt} onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })} /></label>
        <label>Motivo de consulta<textarea required rows={4} value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} placeholder="Describe el motivo de la visita" /></label>
        <div className="form-actions"><button className="primary-button" disabled={saving}>{saving ? 'Guardando...' : editingId === null ? 'Crear cita' : 'Guardar cambios'}</button>{editingId !== null && <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancelar edición</button>}</div>
      </form>
      <section className="appointment-list"><div className="list-title"><div><p className="eyebrow">Agenda</p><h2>Citas registradas</h2></div><span>{appointments.length}</span></div>{message && <p className="notice">{message}</p>}{loading ? <p className="empty">Cargando citas...</p> : appointments.length === 0 ? <p className="empty">No hay citas registradas.</p> : <ul>{appointments.map((appointment) => <li className="appointment-item" key={appointment.id}><div><strong>{appointment.petName}</strong><span>{formatDate(appointment.scheduledAt)}</span><span>{appointment.reason}</span></div><div className="appointment-actions"><span className={`status status-${appointment.status.toLowerCase()}`}>{labels[appointment.status]}</span>{appointment.status !== 'CANCELLED' && <><button className="text-button" onClick={() => edit(appointment)}>Modificar</button><button className="text-button danger-button" onClick={() => void cancel(appointment.id)}>Cancelar</button></>}</div></li>)}</ul>}</section>
    </section>
  </main>;
}