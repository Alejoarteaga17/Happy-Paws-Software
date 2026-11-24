'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import { useAuth } from '../../context/auth-context';
import { getOwnerPortal } from '../../services/portal-service';
import { Appointment } from '../../types/appointment';
import { Pet } from '../../types/pet';
import { Vaccination } from '../../types/vaccination';
import { ClinicalNote } from '../../types/clinical-note';
import { Icon, StatusBadge } from '../../components/ui';

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
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    getOwnerPortal()
      .then(
        ({
          pets: loadedPets,
          appointments: loadedAppointments,
          vaccinations: loadedVaccinations,
          clinicalNotes: loadedClinicalNotes,
        }) => {
          setPets(loadedPets);
          setAppointments(loadedAppointments);
          setVaccinations(loadedVaccinations);
          setClinicalNotes(loadedClinicalNotes);
        },
      )
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'No se pudo cargar el portal'));
  }, []);

  useEffect(() => {
    if (!selectedPet) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPet(null);
    };
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [selectedPet]);

  const closePetDetails = () => setSelectedPet(null);

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
                    <button
                      className="portal-pet-trigger"
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={`Ver detalles de ${pet.name}`}
                      onClick={() => setSelectedPet(pet)}
                    >
                      <span>
                        <strong>{pet.name}</strong>
                        <span>
                          {pet.species} · {pet.petTag}
                        </span>
                      </span>
                      <span className="portal-pet-weight">{pet.weight ? `${pet.weight} kg` : 'Sin peso'}</span>
                      <Icon name="chevron_right" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">No hay mascotas vinculadas.</p>
            )}
          </section>
          <section className="summary-panel">
            <p className="eyebrow">Historial clínico</p>
            <h2>Notas recientes</h2>
            {clinicalNotes.length ? (
              <ul>
                {clinicalNotes.slice(0, 5).map((note) => (
                  <li className="appointment-item" key={note.id}>
                    <div>
                      <strong>{note.petName}</strong>
                      <span>
                        {note.diagnosis} · {note.treatment}
                      </span>
                      {note.observations && <span>{note.observations}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">No hay notas clínicas registradas.</p>
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
      {selectedPet && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePetDetails();
          }}
        >
          <section className="pet-details-modal" role="dialog" aria-modal="true" aria-labelledby="pet-details-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Ficha de mascota</p>
                <h2 id="pet-details-title">{selectedPet.name}</h2>
              </div>
              <button
                ref={closeButtonRef}
                className="close-button"
                type="button"
                aria-label={`Cerrar detalles de ${selectedPet.name}`}
                onClick={closePetDetails}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="pet-details-content">
              {selectedPet.photoUrl && (
                <Image
                  className="pet-details-photo"
                  src={selectedPet.photoUrl}
                  alt={selectedPet.name}
                  width={120}
                  height={120}
                  unoptimized
                />
              )}
              <dl className="pet-details-grid">
                <div>
                  <dt>Identificación</dt>
                  <dd>{selectedPet.petTag}</dd>
                </div>
                <div>
                  <dt>Especie</dt>
                  <dd>{selectedPet.species}</dd>
                </div>
                <div>
                  <dt>Raza</dt>
                  <dd>{selectedPet.breed || 'Sin registrar'}</dd>
                </div>
                <div>
                  <dt>Fecha de nacimiento</dt>
                  <dd>
                    {selectedPet.birthDate
                      ? new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(
                          new Date(
                            selectedPet.birthDate.includes('T')
                              ? selectedPet.birthDate
                              : `${selectedPet.birthDate}T00:00:00`,
                          ),
                        )
                      : 'Sin registrar'}
                  </dd>
                </div>
                <div>
                  <dt>Sexo</dt>
                  <dd>
                    {selectedPet.sex === 'MALE' ? 'Macho' : selectedPet.sex === 'FEMALE' ? 'Hembra' : 'Sin registrar'}
                  </dd>
                </div>
                <div>
                  <dt>Peso</dt>
                  <dd>{selectedPet.weight ? `${selectedPet.weight} kg` : 'Sin registrar'}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
