'use client';

import { FormEvent, useEffect, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import { createClinicalNote, getClinicalNotes } from '../../services/clinical-note-service';
import { getAppointments } from '../../services/appointment-service';
import { Appointment } from '../../types/appointment';
import { ClinicalNote } from '../../types/clinical-note';

export default function ClinicalNotesPage() {
  return (
    <RestrictedView permission="manage_clinical_notes">
      <ClinicalNotesView />
    </RestrictedView>
  );
}

function ClinicalNotesView() {
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState({ appointmentId: '', diagnosis: '', treatment: '', observations: '' });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [loadedNotes, loadedAppointments] = await Promise.all([getClinicalNotes(), getAppointments()]);
    setNotes(loadedNotes);
    setAppointments(loadedAppointments);
  };

  useEffect(() => {
    void load().catch((reason) =>
      setError(reason instanceof Error ? reason.message : 'No se pudieron cargar las notas'),
    );
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createClinicalNote({
        appointmentId: Number(form.appointmentId),
        diagnosis: form.diagnosis,
        treatment: form.treatment,
        observations: form.observations || undefined,
      });
      setForm({ appointmentId: '', diagnosis: '', treatment: '', observations: '' });
      setError(null);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo guardar la nota');
    }
  };

  return (
    <main className="summary-page">
      <AppHeader />
      <section className="summary-content">
        <header className="summary-hero">
          <div>
            <p className="eyebrow">Historial clínico</p>
            <h1>Notas clínicas</h1>
            <p className="summary-subtitle">Registra diagnósticos, tratamientos y observaciones de cada consulta.</p>
          </div>
        </header>
        <section className="summary-panel table-panel">
          <form className="appointment-form" onSubmit={submit}>
            <label>
              Cita
              <select
                required
                value={form.appointmentId}
                onChange={(event) => setForm({ ...form, appointmentId: event.target.value })}
              >
                <option value="">Selecciona una cita</option>
                {appointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    #{appointment.id} · {appointment.petName} · {appointment.reason}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Diagnóstico
              <input
                required
                value={form.diagnosis}
                onChange={(event) => setForm({ ...form, diagnosis: event.target.value })}
              />
            </label>
            <label>
              Tratamiento
              <textarea
                required
                value={form.treatment}
                onChange={(event) => setForm({ ...form, treatment: event.target.value })}
              />
            </label>
            <label>
              Observaciones
              <textarea
                value={form.observations}
                onChange={(event) => setForm({ ...form, observations: event.target.value })}
              />
            </label>
            <button className="primary-button" type="submit">
              Guardar nota
            </button>
          </form>
          {error && <p className="form-error">{error}</p>}
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Mascota</th>
                <th>Diagnóstico</th>
                <th>Tratamiento</th>
                <th>Veterinario</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id}>
                  <td>{new Date(note.createdAt).toLocaleDateString('es-CO')}</td>
                  <td>{note.petName}</td>
                  <td>{note.diagnosis}</td>
                  <td>{note.treatment}</td>
                  <td>{note.veterinarianName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!notes.length && !error && <p className="empty">No hay notas clínicas registradas.</p>}
        </section>
      </section>
    </main>
  );
}
