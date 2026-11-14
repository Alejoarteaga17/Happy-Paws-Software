'use client';

import { UserRole } from '../context/auth-context';
import { UserRow } from '../services/user-service';

interface UserTableProps {
  users: UserRow[];
  allowedRoles: UserRole[];
  canChangeStatus: boolean;
  onRoleChange: (id: string, role: UserRole) => void;
  onStatusChange: (user: UserRow) => void;
}

export default function UserTable({
  users,
  allowedRoles,
  canChangeStatus,
  onRoleChange,
  onStatusChange,
}: UserTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Estado</th>
          {canChangeStatus && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>
              <select value={user.role} onChange={(event) => onRoleChange(user.id, event.target.value as UserRole)}>
                {allowedRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <span className={`status ${user.active ? 'status-completed' : 'status-cancelled'}`}>
                {user.active ? 'Activo' : 'Inactivo'}
              </span>
            </td>
            {canChangeStatus && (
              <td>
                <button className="text-button" onClick={() => onStatusChange(user)}>
                  {user.active ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
