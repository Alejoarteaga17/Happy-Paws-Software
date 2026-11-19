import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import UserTable from '../src/components/user-table';

const users = [
  { id: 'owner-1', email: 'ana@example.com', full_name: 'Ana', role: 'OWNER' as const, active: true },
  { id: 'vet-1', email: 'vet@example.com', full_name: 'Dr. Vet', role: 'VET' as const, active: false },
];

describe('UserTable', () => {
  it('renders only allowed role options and exposes status actions for administrators', () => {
    const onRoleChange = vi.fn();
    const onStatusChange = vi.fn();

    const markup = renderToStaticMarkup(
      <UserTable
        users={users}
        allowedRoles={['OWNER', 'VET']}
        canChangeStatus
        onRoleChange={onRoleChange}
        onStatusChange={onStatusChange}
      />,
    );

    expect(markup).toContain('Ana');
    expect(markup).toContain('Activo');
    expect(markup).toContain('Inactivo');
    expect(markup.match(/<option/g)).toHaveLength(4);
    expect(markup).toContain('Desactivar');
    expect(markup).toContain('Activar');
    expect(onRoleChange).not.toHaveBeenCalled();
    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it('hides status actions when the caller cannot manage accounts', () => {
    const onRoleChange = vi.fn();
    const onStatusChange = vi.fn();

    const markup = renderToStaticMarkup(
      <UserTable
        users={users}
        allowedRoles={['OWNER']}
        canChangeStatus={false}
        onRoleChange={onRoleChange}
        onStatusChange={onStatusChange}
      />,
    );

    expect(markup.match(/<button/g)).toBeNull();
    expect(markup.match(/<option/g)).toHaveLength(2);
  });
});
