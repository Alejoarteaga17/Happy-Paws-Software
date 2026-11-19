import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RestrictedView from '../src/components/restricted-view';

vi.mock('../src/context/auth-context', () => ({
  useAuth: () => ({ can: () => false, loading: false }),
}));

vi.mock('../src/components/app-header', () => ({
  default: () => React.createElement('header', null, 'Happy Paws'),
}));

describe('RestrictedView', () => {
  it('renders a restricted response instead of protected children', () => {
    const markup = renderToStaticMarkup(
      <RestrictedView permission="manage_owners">
        <p>Datos protegidos</p>
      </RestrictedView>,
    );

    expect(markup).toContain('Acceso restringido');
    expect(markup).not.toContain('Datos protegidos');
  });
});
