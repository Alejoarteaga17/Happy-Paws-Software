import { describe, expect, it } from 'vitest';
import { permissions, UserRole } from '../src/context/auth-context';
import { navigationItems } from '../src/components/app-header';

const roleCases: Array<[UserRole, string[], string[]]> = [
  ['ADMIN', ['manage_owners', 'manage_pets', 'manage_users', 'view_audit'], []],
  ['RECEPTIONIST', ['manage_owners', 'manage_pets', 'search_records'], ['manage_users', 'view_audit']],
  ['VET', ['edit_pets_basic', 'manage_vaccinations', 'manage_clinical_notes'], ['manage_owners', 'manage_users']],
  ['OWNER', ['view_owner_portal'], ['manage_owners', 'manage_pets', 'view_audit', 'search_records']],
];

describe('role permission matrix', () => {
  it.each(roleCases)('%s has only documented capabilities', (role, allowed, denied) => {
    allowed.forEach((permission) => expect(permissions[role]).toContain(permission));
    denied.forEach((permission) => expect(permissions[role]).not.toContain(permission));
  });

  it('matches role visibility in main navigation', () => {
    expect(navigationItems.find((item) => item.href === '/portal')?.roles).toEqual(['OWNER']);
    expect(navigationItems.find((item) => item.href === '/audit')?.roles).toEqual(['ADMIN']);
    expect(navigationItems.find((item) => item.href === '/users')?.roles).toEqual(['ADMIN']);
    expect(navigationItems.find((item) => item.href === '/appointments')?.roles).not.toContain('OWNER');
  });
});
