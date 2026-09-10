'use client';

import { useEffect, useMemo, useState } from 'react';
import AppHeader from '../components/app-header';
import { getAppointments } from '../services/appointment-service';
import { getPets } from '../services/pet-service';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client';
import { getVaccinations } from '../services/vaccination-service';
import { Appointment } from '../types/appointment';
import { Pet } from '../types/pet';
import { Vaccination } from '../types/vaccination';

const formatLongDate = (date: Date) => new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
const formatTime = (value: string) => new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
const formatShortDate = (value: string) => new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(new Date(`${value}T00:00:00`));
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const getShift = (hour: number) => hour < 12 ? 'mañana' : 'tarde';
const getGreeting = (hour: number) => hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
const appointmentLabels: Record<Appointment['status'], string> = { SCHEDULED: 'Agendada', COMPLETED: 'Completada', CANCELLED: 'Cancelada' };

function LoadingState() {
  return <div className="summary-loading" aria-label="Cargando resumen"><span /><span /><span /></div>;
}

function AppointmentStatus({ appointment }: { appointment: Appointment }) {
  return <span className={`status status-${appointment.status.toLowerCase()}`}>{appointmentLabels[appointment.status]}</span>;
}

export default function SummaryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [userName, setUserName] = useState('equipo Happy Paws');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const today = useMemo(() => new Date(), []);
  const todayStart = startOfDay(today);
  const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const weekEnd = new Date(todayStart); weekEnd.setDate(weekEnd.getDate() + 7);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        if (!isSupabaseConfigured) throw new Error('Configura Supabase para consultar el resumen');
        const { data: userData } = await getSupabaseClient().auth.getUser();
        if (!userData.user) { window.location.href = '/login'; return; }
        setUserName(userData.user.user_metadata?.full_name ?? userData.user.email?.split('@')[0] ?? 'equipo Happy Paws');
        const [appointmentData, petData, vaccinationData] = await Promise.all([getAppointments(), getPets(), getVaccinations()]);
        setAppointments(appointmentData); setPets(petData); setVaccinations(vaccinationData);
      } catch (error) { setErrorMessage(error instanceof Error ? error.message : 'No se pudo cargar el resumen'); }
      finally { setLoading(false); }
    };
    void loadSummary();
  }, []);

  const todaysAppointments = appointments.filter(({ scheduledAt, status }) => { const date = new Date(scheduledAt); return date >= todayStart && date < tomorrowStart && status !== 'CANCELLED'; });
  const upcomingCare = vaccinations.filter(({ status }) => status === 'PENDING' || status === 'OVERDUE').sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate)).slice(0, 5);
  const activePetsThisMonth = pets.filter(({ createdAt }) => createdAt && new Date(createdAt) >= monthStart).length;
  const weeklyFollowUps = appointments.filter(({ scheduledAt, status }) => { const date = new Date(scheduledAt); return date >= todayStart && date < weekEnd && status === 'SCHEDULED'; }).length + vaccinations.filter(({ nextDueDate, status }) => { const date = new Date(`${nextDueDate}T00:00:00`); return date >= todayStart && date < weekEnd && status === 'PENDING'; }).length;
  const petsById = useMemo(() => new Map(pets.map((pet) => [pet.id, pet])), [pets]);

  return <main className="summary-page"><AppHeader /><section className="summary-content">
    <header className="summary-hero"><div><p className="eyebrow">{formatLongDate(today)} · turno de {getShift(today.getHours())}</p><h1>{getGreeting(today.getHours())}, {userName}</h1><p className="summary-subtitle">Aquí tienes el pulso de la clínica para empezar el día.</p></div><a className="primary-button check-in-button" href="/appointments"><span className="material-symbols-outlined">add_circle</span>Nuevo check-in</a></header>
    {errorMessage && <p className="notice summary-error" role="alert">{errorMessage}</p>}
    {loading ? <LoadingState /> : <>
      <section className="summary-stats" aria-label="Estadísticas de la clínica"><article><span className="summary-stat-icon"><span className="material-symbols-outlined">event</span></span><span className="stat-label">Citas de hoy</span><strong>{todaysAppointments.length}</strong><small>{todaysAppointments.length ? `${todaysAppointments.length} check-ins pendientes` : 'sin check-ins pendientes'}</small></article><article><span className="summary-stat-icon"><span className="material-symbols-outlined">pets</span></span><span className="stat-label">Mascotas activas</span><strong>{pets.length}</strong><small>+{activePetsThisMonth} este mes</small></article><article className="summary-stat-alert"><span className="summary-stat-icon"><span className="material-symbols-outlined">vaccines</span></span><span className="stat-label">Vacunas vencidas</span><strong>{vaccinations.filter(({ status }) => status === 'OVERDUE').length}</strong><small>requieren seguimiento</small></article><article><span className="summary-stat-icon"><span className="material-symbols-outlined">pending_actions</span></span><span className="stat-label">Seguimientos esta semana</span><strong>{weeklyFollowUps}</strong><small>sin asignar</small></article></section>
      <section className="summary-columns"><section className="summary-panel summary-agenda"><div className="summary-panel-heading"><div><p className="eyebrow">Agenda clínica</p><h2>Agenda de hoy</h2></div><a href="/appointments">Ver todas</a></div>{todaysAppointments.length ? <ul>{todaysAppointments.map((appointment) => { const pet = petsById.get(appointment.petId); return <li className="summary-list-row" key={appointment.id}><time>{formatTime(appointment.scheduledAt)}</time><div><strong>{appointment.petName}</strong><span>{pet?.petTag ?? 'Sin pet tag'} · {pet?.ownerName ?? 'Propietario no disponible'}</span><span>{appointment.reason}</span></div><AppointmentStatus appointment={appointment} /></li>; })}</ul> : <div className="summary-empty"><span className="material-symbols-outlined">event_available</span><strong>No hay citas para hoy</strong><span>La agenda está libre por ahora.</span></div>}</section><section className="summary-panel summary-care"><div className="summary-panel-heading"><div><p className="eyebrow">Control preventivo</p><h2>Cuidados pendientes</h2></div><a href="/vaccinations">Módulo</a></div>{upcomingCare.length ? <ul>{upcomingCare.map((vaccination) => <li className="summary-list-row" key={vaccination.id}><span className={`care-icon ${vaccination.status === 'OVERDUE' ? 'overdue' : ''}`}><span className="material-symbols-outlined">vaccines</span></span><div><strong>{vaccination.petName}</strong><span>{vaccination.vaccineName}</span><span>{formatShortDate(vaccination.nextDueDate)}</span></div><span className={`status ${vaccination.status === 'OVERDUE' ? 'status-overdue' : 'status-pending'}`}>{vaccination.status === 'OVERDUE' ? 'Vencida' : 'Próxima'}</span></li>)}</ul> : <div className="summary-empty"><span className="material-symbols-outlined">task_alt</span><strong>Todo está al día</strong><span>No hay cuidados pendientes.</span></div>}<p className="summary-note">Los recordatorios automáticos por SMS/email quedan fuera del MVP.</p></section></section>
    </>}
  </section></main>;
}
