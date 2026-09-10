'use client';

import { useEffect, useMemo, useState } from 'react';
import { createVaccination, getVaccinations } from '../services/vaccination-service';
import { getPets } from '../services/pet-service';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client';
import { Vaccination, VaccinationStatus } from '../types/vaccination';
import { Pet } from '../types/pet';
import AppHeader from './app-header';

const statusLabels: Record<VaccinationStatus, string> = { ADMINISTERED: 'Aplicada', PENDING: 'Próxima', OVERDUE: 'Vencida' };
const emptyVaccinationForm = { petId: '', vaccineName: '', administeredAt: '', nextDueDate: '', status: 'PENDING' as VaccinationStatus };
const formatDate = (value: string) => new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));

function StatusBadge({ status }: { status: VaccinationStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}>{statusLabels[status]}</span>;
}

function VaccinationRow({ vaccination }: { vaccination: Vaccination }) {
  return <li className="vaccination-row"><div className="pet-avatar" aria-hidden="true">{vaccination.petName.slice(0, 1)}</div><div className="vaccination-copy"><strong>{vaccination.petName}</strong><span>{vaccination.vaccineName}</span></div><div className="due-date"><span>{vaccination.status === 'OVERDUE' ? 'Venció' : 'Próxima dosis'}</span><strong>{formatDate(vaccination.nextDueDate)}</strong></div><StatusBadge status={vaccination.status} /></li>;
}

export default function VaccinationDashboard() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [filter, setFilter] = useState<'ALL' | VaccinationStatus>('ALL');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('Usuario autenticado');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyVaccinationForm);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!isSupabaseConfigured) throw new Error('Configura Supabase para iniciar sesión y consultar las vacunaciones');
        const { data: userData } = await getSupabaseClient().auth.getUser();
        if (!userData.user) { window.location.href = '/login'; return; }
        setUserEmail(userData.user.email ?? 'Usuario autenticado');
        setAuthLoading(false);
        const [vaccinationData, petData] = await Promise.all([getVaccinations(), getPets()]);
        setVaccinations(vaccinationData); setPets(petData);
      } catch (error) { setErrorMessage(error instanceof Error ? error.message : 'No se pudieron cargar los datos'); }
      finally { setLoading(false); setAuthLoading(false); }
    };
    void loadDashboard();
  }, []);

  const signOut = async () => { await getSupabaseClient().auth.signOut(); window.location.href = '/login'; };
  const filtered = useMemo(() => filter === 'ALL' ? vaccinations : vaccinations.filter(({ status }) => status === filter), [filter, vaccinations]);
  const upcoming = filtered.filter(({ status }) => status === 'PENDING');
  const overdue = filtered.filter(({ status }) => status === 'OVERDUE');
  const administered = vaccinations.filter(({ status }) => status === 'ADMINISTERED').length;
  const closeForm = () => { if (!isSaving) setIsFormOpen(false); };
  const saveVaccination = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setFormError(null); setIsSaving(true);
    try {
      await createVaccination({ petId: Number(form.petId), vaccineName: form.vaccineName.trim(), administeredAt: form.administeredAt, nextDueDate: form.nextDueDate, status: form.status });
      setVaccinations(await getVaccinations()); setForm(emptyVaccinationForm); setIsFormOpen(false);
    } catch (error) { setFormError(error instanceof Error ? error.message : 'No se pudo guardar la vacuna'); }
    finally { setIsSaving(false); }
  };

  return <main className="vaccination-page"><AppHeader /><section className="content vaccination-content" id="vacunaciones">
    <header className="topbar"><div><span className="eyebrow">Módulo preventivo</span><h1>Vacunaciones</h1></div><div className="user-chip"><span className="user-avatar">HP</span><span><strong>{userEmail}</strong><small>Sesión de Supabase</small></span><button className="text-button logout-button" type="button" onClick={() => void signOut()}>Salir</button></div></header>
    <section className="intro"><div><p className="eyebrow">Control preventivo</p><h2>Vacunas al día, pacientes protegidos.</h2><p>Revisa las próximas dosis y atiende los vencimientos de la clínica.</p></div><button className="intro-icon" type="button" aria-label="Registrar vacunación" title="Registrar vacunación" onClick={() => setIsFormOpen(true)}><span className="material-symbols-outlined">vaccines</span></button></section>
    {(loading || authLoading) && <p className="empty">Cargando datos desde Supabase...</p>}{errorMessage && <p className="empty">{errorMessage}</p>}
    <div className="stats" aria-label="Resumen de vacunaciones"><article><span className="stat-label">Próximas dosis</span><strong>{vaccinations.filter(({ status }) => status === 'PENDING').length}</strong><small>requieren seguimiento</small></article><article className="stat-alert"><span className="stat-label">Vencidas</span><strong>{vaccinations.filter(({ status }) => status === 'OVERDUE').length}</strong><small>prioridad de atención</small></article><article><span className="stat-label">Aplicadas</span><strong>{administered}</strong><small>en el registro</small></article></div>
    <div className="section-heading"><div><p className="eyebrow">Agenda preventiva</p><h2>Seguimiento de dosis</h2></div><div className="filters" role="group" aria-label="Filtrar vacunaciones">{(['ALL', 'PENDING', 'OVERDUE'] as const).map((value) => <button key={value} className={filter === value ? 'filter active' : 'filter'} onClick={() => setFilter(value)}>{value === 'ALL' ? 'Todas' : statusLabels[value]}</button>)}</div></div>
    <div className="lists"><section className="list-panel"><div className="list-title"><h3>Próximas vacunas</h3><span>{upcoming.length}</span></div>{upcoming.length ? <ul>{upcoming.map((vaccination) => <VaccinationRow key={vaccination.id} vaccination={vaccination} />)}</ul> : <p className="empty">No hay próximas dosis en este filtro.</p>}</section><section className="list-panel overdue-panel"><div className="list-title"><h3>Requieren atención</h3><span>{overdue.length}</span></div>{overdue.length ? <ul>{overdue.map((vaccination) => <VaccinationRow key={vaccination.id} vaccination={vaccination} />)}</ul> : <p className="empty">No hay vacunas vencidas. Buen trabajo.</p>}</section></div>
  </section>
  {isFormOpen && <div className="modal-backdrop" role="presentation" onMouseDown={closeForm}><section className="vaccination-modal" role="dialog" aria-modal="true" aria-labelledby="vaccination-form-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">Registro clínico</p><h2 id="vaccination-form-title">Agregar vacunación</h2></div><button className="close-button" type="button" aria-label="Cerrar formulario" onClick={closeForm}>×</button></div><p className="modal-description">Registra la dosis aplicada y la fecha de seguimiento para la mascota.</p><form onSubmit={saveVaccination}><label className="form-field">Mascota<select required value={form.petId} onChange={(event) => setForm({ ...form, petId: event.target.value })}><option value="">Selecciona una mascota</option>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name} · {pet.species} · {pet.petTag}</option>)}</select></label><label className="form-field">Nombre de la vacuna<input required value={form.vaccineName} onChange={(event) => setForm({ ...form, vaccineName: event.target.value })} placeholder="Ej. Rabia" /></label><div className="form-grid"><label className="form-field">Fecha de aplicación<input required type="date" value={form.administeredAt} onChange={(event) => setForm({ ...form, administeredAt: event.target.value })} /></label><label className="form-field">Próxima dosis<input required type="date" min={form.administeredAt || undefined} value={form.nextDueDate} onChange={(event) => setForm({ ...form, nextDueDate: event.target.value })} /></label></div><label className="form-field">Estado<select required value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as VaccinationStatus })}><option value="PENDING">Pendiente</option><option value="ADMINISTERED">Aplicada</option><option value="OVERDUE">Vencida</option></select></label>{formError && <p className="form-error" role="alert">{formError}</p>}<div className="modal-actions"><button className="secondary-button" type="button" onClick={closeForm}>Cancelar</button><button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar vacunación'}</button></div></form></section></div>}
  </main>;
}
