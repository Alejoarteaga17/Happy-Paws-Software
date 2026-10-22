'use client';

import { useEffect, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import UserAccountForm, { OwnerOption, UserAccountFormValues } from '../../components/user-account-form';
import { getOwners } from '../../services/owner-service';
import { getSupabaseClient } from '../../services/supabase-client';
import { UserRole } from '../../context/auth-context';

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export default function UsersPage() {
  return (
    <RestrictedView permission="manage_users">
      <UsersTable />
    </RestrictedView>
  );
}

function UsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [owners, setOwners] = useState<OwnerOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  useEffect(() => {
    const loadData = async () => {
      const [{ data, error: queryError }, loadedOwners] = await Promise.all([
        getSupabaseClient().from('profiles').select('id,email,full_name,role').order('full_name'),
        getOwners(),
      ]);
      if (queryError) setError(queryError.message);
      else setUsers((data ?? []) as UserRow[]);
      setOwners(loadedOwners);
    };

    void loadData().catch((loadError: Error) => setError(loadError.message));
  }, []);

  const handleCreateOwnerAccount = (_values: UserAccountFormValues) => {
    setFeedback('La cuenta está lista para registrarse. La conexión con Supabase se habilitará en el siguiente paso.');
  };

  return (
    <main className="summary-page">
      <AppHeader />
      <section className="summary-content">
        <header className="summary-hero">
          <div>
            <p className="eyebrow">Administración</p>
            <h1>Usuarios y roles</h1>
            <p className="summary-subtitle">Revisa los perfiles autorizados en Care Central.</p>
          </div>
        </header>
        {feedback && <p className="notice summary-error">{feedback}</p>}
        <UserAccountForm
          role="OWNER"
          owners={owners}
          existingEmails={users.map((user) => user.email)}
          onSubmit={handleCreateOwnerAccount}
        />
        <section className="summary-panel table-panel">
          {error && <p className="form-error">{error}</p>}
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="status status-scheduled">{user.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
