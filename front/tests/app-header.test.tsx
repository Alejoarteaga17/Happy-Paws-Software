import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import AppHeader from '../src/components/app-header';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('../src/context/auth-context', () => ({
  useAuth: () => ({
    profile: { id: 'owner-1', email: 'owner@example.com', fullName: 'Ana', role: 'OWNER' },
    signOut: vi.fn(),
  }),
}));
vi.mock('../src/components/ui', () => ({
  BrandMark: () => React.createElement('span', null, 'Brand'),
  Icon: ({ name }: { name: string }) => React.createElement('span', null, name),
  UserAvatar: ({ label }: { label: string }) => React.createElement('span', null, label),
}));

describe('AppHeader role navigation', () => {
  it('shows OWNER portal and hides staff routes', () => {
    const markup = renderToStaticMarkup(<AppHeader />);
    expect(markup).toContain('Mi portal');
    expect(markup).not.toContain('Propietarios');
    expect(markup).not.toContain('Notas clínicas');
  });
});
