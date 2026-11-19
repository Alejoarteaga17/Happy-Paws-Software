import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { UserAvatar } from '../src/components/ui';

vi.mock('@blobatar/react', () => ({
  Blobatar: ({ name, title, ...props }: { name: string; title?: string; [key: string]: unknown }) =>
    React.createElement('span', { ...props, 'data-avatar-seed': name, title }),
}));

describe('UserAvatar', () => {
  it('uses the user id as a stable avatar seed and exposes the user label', () => {
    const markup = renderToStaticMarkup(<UserAvatar seed="user-123" label="Ana Pérez" />);

    expect(markup).toContain('data-avatar-seed="user-123"');
    expect(markup).toContain('title="Avatar de Ana Pérez"');
    expect(markup).toContain('size="36"');
  });
});
