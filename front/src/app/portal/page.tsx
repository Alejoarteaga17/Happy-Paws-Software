'use client';

import { useEffect, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import { useAuth } from '../../context/auth-context';
import { getAppointments } from '../../services/appointment-service';
import { getPets } from '../../services/pet-service';
import { getVaccinations } from '../../services/vaccination-service';
import { Appointment } from '../../types/appointment';
import { Pet } from '../../types/pet';
import { Vaccination } from '../../types/vaccination';
import { StatusBadge } from '../../components/ui';

export default function OwnerPortalPage() {
  return (
    <RestrictedView permission="view_owner_portal">
      <OwnerPortal />
    </RestrictedView>
  );
}

function OwnerPortal() {
  const { profile } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPets(), getAppointments(), getVaccinations()])
      .then(([loadedPets, loadedAppointments, loadedVaccinations]) => {
        setPets(loadedPets);
        setAppointments(loadedAppointments);
        setVaccinations(loadedVaccinations);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'No se pudo cargar el portal'));
  }, []);

  return (
    <main className="summary-page">
      <AppHeader />
      <section className="summary-content">
        <header className="summary-hero">
          <div>
            <p className="eyebrow">Portal de propietarios</p>
            <h1>Hola, {profile?.fullName}</h1>
            <p className="summary-subtitle">Consulta la salud y las próximas atenciones de tus mascotas.</p>
          </div>
        </header>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="portal-grid">
          <section className="summary-panel">
            <p className="eyebrow">Mis mascotas</p>
            <h2>{pets.length} pacientes</h2>
            {pets.length ? (
              <ul>
                {pets.map((pet) => (
                  <li className="appointment-item" key={pet.id}>
                    <div>
                      <strong>{pet.name}</strong>
                      <span>
                        {pet.species} · {pet.petTag}
                      </span>
                    </div>
                    <span>{pet.weight ? `${pet.weight} kg` : 'Sin peso'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">No hay mascotas vinculadas.</p>
            )}
          </section>
          <section className="summary-panel">
            <p className="eyebrow">Próximas citas</p>
            <h2>Agenda familiar</h2>
            {appointments.length ? (
              <ul>
                {appointments.slice(0, 5).map((appointment) => (
                  <li className="appointment-item" key={appointment.id}>
                    <div>
                      <strong>{appointment.petName}</strong>
                      <span>
                        {new Date(appointment.scheduledAt).toLocaleString('es-CO')} · {appointment.reason}
                      </span>
                    </div>
                    <StatusBadge
                      tone={appointment.status.toLowerCase()}
                      label={
                        appointment.status === 'SCHEDULED'
                          ? 'Agendada'
                          : appointment.status === 'COMPLETED'
                            ? 'Completada'
                            : 'Cancelada'
                      }
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">No hay citas registradas.</p>
            )}
          </section>
          <section className="summary-panel">
            <p className="eyebrow">Control preventivo</p>
            <h2>Vacunaciones</h2>
            {vaccinations.length ? (
              <ul>
                {vaccinations.slice(0, 5).map((vaccination) => (
                  <li className="appointment-item" key={vaccination.id}>
                    <div>
                      <strong>{vaccination.petName}</strong>
                      <span>
                        {vaccination.vaccineName} · próxima {vaccination.nextDueDate}
                      </span>
                    </div>
                    <StatusBadge
                      tone={vaccination.status.toLowerCase()}
                      label={
                        vaccination.status === 'ADMINISTERED'
                          ? 'Aplicada'
                          : vaccination.status === 'PENDING'
                            ? 'Próxima'
                            : 'Vencida'
                      }
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">No hay vacunas registradas.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
