'use client';

import { FormEvent, useState } from 'react';
import { Icon } from './ui';

export type UserAccountRole = 'OWNER' | 'VET' | 'ADMIN';

export interface OwnerOption {
  id: number;
  fullName: string;
  email: string | null;
}

export interface UserAccountFormValues {
  email: string;
  password: string;
  ownerId: number | null;
  role: UserAccountRole;
}

interface UserAccountFormProps {
  role: UserAccountRole;
  owners: OwnerOption[];
  existingEmails?: string[];
  onSubmit: (values: UserAccountFormValues) => void;
}

interface FormErrors {
  email?: string;
  ownerId?: string;
  password?: string;
  passwordConfirmation?: string;
}

const roleLabels: Record<UserAccountRole, string> = {
  OWNER: 'Propietario',
  VET: 'Veterinario',
  ADMIN: 'Administrador',
};

function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

export default function UserAccountForm({ role, owners, existingEmails = [], onSubmit }: UserAccountFormProps) {
  const [email, setEmail] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) nextErrors.email = 'Ingresa un correo válido.';
    else if (existingEmails.some((existingEmail) => existingEmail.toLowerCase() === normalizedEmail)) {
      nextErrors.email = 'Este correo ya tiene una cuenta registrada.';
    }
    if (role === 'OWNER' && !ownerId) nextErrors.ownerId = 'Selecciona el propietario que tendrá acceso.';
    if (!isStrongPassword(password)) {
      nextErrors.password = 'Usa al menos 8 caracteres, una mayúscula, una minúscula y un número.';
    }
    if (password !== passwordConfirmation) nextErrors.passwordConfirmation = 'Las contraseñas no coinciden.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      email: normalizedEmail,
      password,
      ownerId: role === 'OWNER' ? Number(ownerId) : null,
      role,
    });
    setEmail('');
    setOwnerId('');
    setPassword('');
    setPasswordConfirmation('');
  };

  return (
    <section className="summary-panel account-form-panel" aria-labelledby="create-account-title">
      <div className="summary-panel-heading">
        <div>
          <p className="eyebrow">Nueva cuenta</p>
          <h2 id="create-account-title">Crear acceso de {roleLabels[role].toLowerCase()}</h2>
        </div>
        <span className="account-form-icon" aria-hidden="true">
          <Icon name="person_add" />
        </span>
      </div>
      <p className="form-description">
        Asocia un acceso seguro al propietario para que pueda consultar su información desde el portal.
      </p>
      <form className="account-form" onSubmit={submit} noValidate>
        <div className="form-grid">
          {role === 'OWNER' && (
            <label className="form-field">
              Propietario
              <select
                value={ownerId}
                onChange={(event) => setOwnerId(event.target.value)}
                aria-invalid={Boolean(errors.ownerId)}
              >
                <option value="">Selecciona un propietario</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.fullName}
                    {owner.email ? ` · ${owner.email}` : ''}
                  </option>
                ))}
              </select>
              {errors.ownerId && <span className="field-error">{errors.ownerId}</span>}
            </label>
          )}
          <label className="form-field">
            Correo de acceso
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@correo.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label className="form-field">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>
          <label className="form-field">
            Confirmar contraseña
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.passwordConfirmation)}
            />
            {errors.passwordConfirmation && <span className="field-error">{errors.passwordConfirmation}</span>}
          </label>
        </div>
        <div className="form-actions">
          <button className="primary-button" type="submit">
            <Icon name="person_add" />
            Crear cuenta
          </button>
        </div>
      </form>
    </section>
  );
}
