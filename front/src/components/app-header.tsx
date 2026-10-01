'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BrandMark, Icon } from './ui';
import { useAuth, UserRole } from '../context/auth-context';

const navigationItems = [
  { href: '/', label: 'Resumen', icon: 'contextual_token', roles: ['ADMIN', 'VET', 'RECEPTIONIST'] },
  { href: '/portal', label: 'Mi portal', icon: 'pets', roles: ['OWNER'] },
  { href: '/pets', label: 'Pacientes', icon: 'pets', roles: ['ADMIN', 'RECEPTIONIST', 'VET'] },
  { href: '/appointments', label: 'Agenda', icon: 'assignment', roles: ['ADMIN', 'RECEPTIONIST', 'VET', 'OWNER'] },
  { href: '/vaccinations', label: 'Vacunaciones', icon: 'vaccines', roles: ['ADMIN', 'VET', 'RECEPTIONIST', 'OWNER'] },
  { href: '/owners', label: 'Propietarios', icon: 'group', roles: ['ADMIN', 'RECEPTIONIST'] },
  { href: '/users', label: 'Usuarios', icon: 'manage_accounts', roles: ['ADMIN'] },
  { href: '/audit', label: 'Auditoría', icon: 'history', roles: ['ADMIN'] },
];

export default function AppHeader() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

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
        {navigationItems
          .filter((item) => !profile || item.roles.includes(profile.role as UserRole))
          .map((item) => {
            const [itemPath, itemHash] = item.href.split('#');
            const isActive = itemHash ? pathname === itemPath && hash === `#${itemHash}` : pathname === itemPath;

            return (
              <a className={`header-nav-link${isActive ? ' active' : ''}`} href={item.href} key={item.label}>
                <Icon name={item.icon} className="header-nav-icon" />
                <span className="header-nav-label">{item.label}</span>
              </a>
            );
          })}
      </nav>
      <div className="header-profile">
        <a href={profile?.role === 'OWNER' ? '/portal' : '/users'} aria-label="Abrir perfil de usuario" title="Perfil">
          <span className="user-avatar">{profile?.fullName.slice(0, 2).toUpperCase() ?? 'HP'}</span>
        </a>
        {profile && (
          <button
            className="text-button"
            type="button"
            onClick={() => void signOut().then(() => (window.location.href = '/login'))}
          >
            Salir
          </button>
        )}
      </div>
    </header>
  );
}
