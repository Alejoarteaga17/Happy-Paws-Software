'use client';

import AppHeader from './app-header';
import { Permission, useAuth } from '../context/auth-context';

export default function RestrictedView({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const { can, loading } = useAuth();
  if (loading) return <main className="restricted-view">Cargando perfil...</main>;
  if (!can(permission))
    return (
      <main className="restricted-view">
        <AppHeader />
        <h1>Acceso restringido</h1>
        <p>No tienes permisos para consultar esta vista.</p>
      </main>
    );
  return <>{children}</>;
}
