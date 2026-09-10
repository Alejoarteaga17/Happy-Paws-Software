'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigationItems = [
  { href: '/', label: 'Resumen', icon: '⌂' },
  { href: '/pets', label: 'Pacientes', icon: '♡' },
  { href: '/appointments', label: 'Agenda', icon: '▣' },
  { href: '/#vacunaciones', label: 'Vacunaciones', icon: '✚' }
];

export default function AppHeader() {
  const pathname = usePathname();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  return (
    <header className="app-header">
      <a className="header-brand" href="/" aria-label="Ir al resumen de Happy Paws">
        <span className="brand-mark">HP</span>
        <span className="header-brand-copy">Happy Paws<small>Care Central</small></span>
      </a>
      <nav className="header-nav" aria-label="Navegación principal">
        {navigationItems.map((item) => {
          const [itemPath, itemHash] = item.href.split('#');
          const isActive = itemHash ? pathname === itemPath && hash === `#${itemHash}` : pathname === itemPath;

          return (
            <a className={`header-nav-link${isActive ? ' active' : ''}`} href={item.href} key={item.label}>
              <span className="header-nav-icon" aria-hidden="true">{item.icon}</span>
              <span className="header-nav-label">{item.label}</span>
            </a>
          );
        })}
      </nav>
      <a className="header-profile" href="/login" aria-label="Abrir acceso de usuario" title="Acceso de usuario">
        <span className="user-avatar">HP</span>
      </a>
    </header>
  );
}