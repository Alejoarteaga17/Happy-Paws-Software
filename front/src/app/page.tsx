'use client';

import { useEffect, useMemo, useState } from 'react';
import { getVaccinations } from '../services/vaccination-service';
import { getSupabaseClient } from '../services/supabase-client';
import { Vaccination, VaccinationStatus } from '../types/vaccination';

const statusLabels: Record<VaccinationStatus, string> = {
  ADMINISTERED: 'Aplicada',
  PENDING: 'Próxima',
  OVERDUE: 'Vencida'
};

const formatDate = (value: string) => new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));

function StatusBadge({ status }: { status: VaccinationStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}>{statusLabels[status]}</span>;
}

function VaccinationRow({ vaccination }: { vaccination: Vaccination }) {
  return (
    <li className="vaccination-row">
      <div className="pet-avatar" aria-hidden="true">{vaccination.petName.slice(0, 1)}</div>
      <div className="vaccination-copy">
        <strong>{vaccination.petName}</strong>
        <span>{vaccination.vaccineName}</span>
      </div>
      <div className="due-date">
        <span>{vaccination.status === 'OVERDUE' ? 'Venció' : 'Próxima dosis'}</span>
        <strong>{formatDate(vaccination.nextDueDate)}</strong>
      </div>
      <StatusBadge status={vaccination.status} />
    </li>
  );
}

export default function VaccinationDashboard() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [filter, setFilter] = useState<'ALL' | VaccinationStatus>('ALL');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('Usuario autenticado');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: userData }, data] = await Promise.all([
          getSupabaseClient().auth.getUser(),
          getVaccinations()
        ]);
        setUserEmail(userData.user?.email ?? 'Usuario autenticado');
        setVaccinations(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'No se pudieron cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const filtered = useMemo(() => filter === 'ALL' ? vaccinations : vaccinations.filter(({ status }) => status === filter), [filter, vaccinations]);
  const upcoming = filtered.filter(({ status }) => status === 'PENDING');
  const overdue = filtered.filter(({ status }) => status === 'OVERDUE');
  const administered = vaccinations.filter(({ status }) => status === 'ADMINISTERED').length;

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">HP</span><span>Happy Paws<small>Care Central</small></span></div>
        <nav aria-label="Navegación principal">
          <a href="#resumen">Resumen</a>
          <a href="#pacientes">Pacientes</a>
          <a href="#agenda">Agenda</a>
          <a className="active" href="#vacunaciones">Vacunaciones</a>
        </nav>
        <div className="sidebar-note"><span>Seguimiento preventivo</span><strong>Cuida hoy lo que importa mañana.</strong></div>
      </aside>

      <section className="content" id="vacunaciones">
        <header className="topbar"><div><span className="eyebrow">{new Intl.DateTimeFormat('es-CO', { dateStyle: 'full' }).format(new Date())}</span><h1>Panel de vacunaciones</h1></div><div className="user-chip"><span className="user-avatar">HP</span><span><strong>{userEmail}</strong><small>Sesión de Supabase</small></span></div></header>
        <section className="intro"><div><p className="eyebrow">Control preventivo</p><h2>Vacunas al día, pacientes protegidos.</h2><p>Revisa las próximas dosis y atiende los vencimientos de la clínica.</p></div><div className="intro-icon" aria-hidden="true">✚</div></section>

        {loading && <p className="empty">Cargando datos desde Supabase...</p>}
        {errorMessage && <p className="empty">{errorMessage}</p>}

        <div className="stats" aria-label="Resumen de vacunaciones">
          <article><span className="stat-label">Próximas dosis</span><strong>{vaccinations.filter(({ status }) => status === 'PENDING').length}</strong><small>requieren seguimiento</small></article>
          <article className="stat-alert"><span className="stat-label">Vencidas</span><strong>{vaccinations.filter(({ status }) => status === 'OVERDUE').length}</strong><small>prioridad de atención</small></article>
          <article><span className="stat-label">Aplicadas</span><strong>{administered}</strong><small>en el registro</small></article>
        </div>

        <div className="section-heading"><div><p className="eyebrow">Agenda preventiva</p><h2>Seguimiento de dosis</h2></div><div className="filters" role="group" aria-label="Filtrar vacunaciones">
          {(['ALL', 'PENDING', 'OVERDUE'] as const).map((value) => <button key={value} className={filter === value ? 'filter active' : 'filter'} onClick={() => setFilter(value)}>{value === 'ALL' ? 'Todas' : statusLabels[value]}</button>)}
        </div></div>

        <div className="lists">
          <section className="list-panel"><div className="list-title"><h3>Próximas vacunas</h3><span>{upcoming.length}</span></div>{upcoming.length ? <ul>{upcoming.map((vaccination) => <VaccinationRow key={vaccination.id} vaccination={vaccination} />)}</ul> : <p className="empty">No hay próximas dosis en este filtro.</p>}</section>
          <section className="list-panel overdue-panel"><div className="list-title"><h3>Requieren atención</h3><span>{overdue.length}</span></div>{overdue.length ? <ul>{overdue.map((vaccination) => <VaccinationRow key={vaccination.id} vaccination={vaccination} />)}</ul> : <p className="empty">No hay vacunas vencidas. Buen trabajo.</p>}</section>
        </div>
      </section>
    </main>
  );
}