'use client';

import { useEffect, useState } from 'react';
import AppHeader from '../../components/app-header';
import RestrictedView from '../../components/restricted-view';
import UserAccountForm, { OwnerOption, UserAccountFormValues } from '../../components/user-account-form';
import { getOwners } from '../../services/owner-service';
import { createUser, getUsers, updateUserRole, updateUserStatus, UserRow } from '../../services/user-service';
import { UserRole } from '../../context/auth-context';

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
        getUsers()
          .then((users) => ({ data: users, error: null }))
          .catch((loadError: Error) => ({ data: [], error: loadError })),
        getOwners(),
      ]);
      if (queryError) setError(queryError.message);
      else setUsers(data);
      setOwners(loadedOwners);
    };

    void loadData().catch((loadError: Error) => setError(loadError.message));
  }, []);

  const handleCreateOwnerAccount = async (values: UserAccountFormValues) => {
    try {
      const owner = owners.find((candidate) => candidate.id === values.ownerId);
      await createUser({
        ...values,
        fullName: owner?.fullName ?? values.email,
      });
      setFeedback('La cuenta fue creada correctamente.');
      setUsers(await getUsers());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo crear la cuenta');
    }
  };

  const changeRole = async (id: string, role: UserRole) => {
    try {
      await updateUserRole(id, role);
      setUsers(await getUsers());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo actualizar el rol');
    }
  };

  const changeStatus = async (user: UserRow) => {
    try {
      await updateUserStatus(user.id, !user.active);
      setUsers(await getUsers());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo actualizar el estado');
    }
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
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(event) => void changeRole(user.id, event.target.value as UserRole)}
                    >
                      <option value="OWNER">OWNER</option>
                      <option value="RECEPTIONIST">RECEPTIONIST</option>
                      <option value="VET">VET</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status ${user.active ? 'status-completed' : 'status-cancelled'}`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button className="text-button" onClick={() => void changeStatus(user)}>
                      {user.active ? 'Desactivar' : 'Activar'}
                    </button>
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
