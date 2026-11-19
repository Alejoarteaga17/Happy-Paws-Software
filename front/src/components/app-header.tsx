'use client';

import React, { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BrandMark, Icon, UserAvatar } from './ui';
import { useAuth, UserRole } from '../context/auth-context';

export const navigationItems = [
  { href: '/', label: 'Resumen', icon: 'contextual_token', roles: ['ADMIN', 'VET', 'RECEPTIONIST'] },
  { href: '/portal', label: 'Mi portal', icon: 'pets', roles: ['OWNER'] },
  { href: '/pets', label: 'Pacientes', icon: 'pets', roles: ['ADMIN', 'RECEPTIONIST', 'VET'] },
  { href: '/appointments', label: 'Agenda', icon: 'assignment', roles: ['ADMIN', 'RECEPTIONIST', 'VET'] },
  { href: '/vaccinations', label: 'Vacunaciones', icon: 'vaccines', roles: ['ADMIN', 'VET', 'RECEPTIONIST'] },
  { href: '/owners', label: 'Propietarios', icon: 'group', roles: ['ADMIN', 'RECEPTIONIST'] },
  { href: '/search', label: 'Buscar', icon: 'search', roles: ['ADMIN', 'RECEPTIONIST', 'VET'] },
  { href: '/clinical-notes', label: 'Notas clínicas', icon: 'clinical_notes', roles: ['ADMIN', 'VET'] },
  { href: '/users', label: 'Usuarios', icon: 'manage_accounts', roles: ['ADMIN', 'RECEPTIONIST'] },
  { href: '/audit', label: 'Auditoría', icon: 'history', roles: ['ADMIN'] },
];

export default function AppHeader() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [hash, setHash] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  useEffect(() => {
    setProfileMenuOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) setProfileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileMenuOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [profileMenuOpen]);

  const roleLabels: Record<UserRole, string> = {
    OWNER: 'Propietario',
    VET: 'Veterinario',
    ADMIN: 'Administrador',
    RECEPTIONIST: 'Recepcionista',
  };

  const handleSignOut = () => {
    void signOut().then(() => {
      window.location.href = '/login';
    });
  };

  return (
    <header className="app-header">
      <a
        className="header-brand"
        href={profile?.role === 'OWNER' ? '/portal' : '/'}
        aria-label="Ir al resumen de Happy Paws"
      >
        <BrandMark />
        <span className="header-brand-copy">
          Happy Paws<small>Care Central</small>
        </span>
      </a>
      <nav className="header-nav" aria-label="Navegación principal">
        <ul className="header-nav-list">
          {navigationItems
            .filter((item) => !profile || item.roles.includes(profile.role as UserRole))
            .map((item) => {
              const [itemPath, itemHash] = item.href.split('#');
              const isActive = itemHash ? pathname === itemPath && hash === `#${itemHash}` : pathname === itemPath;

              return (
                <li key={item.label}>
                  <a className={`header-nav-link${isActive ? ' active' : ''}`} href={item.href}>
                    <Icon name={item.icon} className="header-nav-icon" />
                    <span className="header-nav-label">{item.label}</span>
                  </a>
                </li>
              );
            })}
        </ul>
      </nav>
      {profile && (
        <div className="header-profile" ref={profileMenuRef}>
          <button
            className="profile-trigger"
            type="button"
            aria-label={`Abrir perfil de ${profile.fullName}`}
            aria-expanded={profileMenuOpen}
            aria-controls="profile-menu"
            onClick={() => setProfileMenuOpen((open) => !open)}
          >
            <UserAvatar seed={profile.email || profile.id} label={profile.fullName} />
            <Icon name="keyboard_arrow_down" className="profile-chevron" />
          </button>
          {profileMenuOpen && (
            <section className="profile-menu" id="profile-menu" aria-label="Perfil de usuario">
              <div className="profile-menu-heading">
                <UserAvatar seed={profile.email || profile.id} label={profile.fullName} />
                <div>
                  <strong>{profile.fullName}</strong>
                  <span>{roleLabels[profile.role]}</span>
                </div>
              </div>
              <dl className="profile-menu-details">
                <div>
                  <dt>Correo</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div>
                  <dt>Rol</dt>
                  <dd>{roleLabels[profile.role]}</dd>
                </div>
              </dl>
              <button className="profile-menu-signout" type="button" onClick={handleSignOut}>
                <Icon name="logout" />
                <span>Cerrar sesión</span>
              </button>
            </section>
          )}
        </div>
      )}
    </header>
  );
}
