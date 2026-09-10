import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import NotFound from '../src/app/not-found';
import ErrorPage from '../src/app/error';

type LinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

vi.mock('next/link', () => ({
  default: ({ href, className, children }: LinkProps) => React.createElement('a', { href, className }, children)
}));

describe('error pages', () => {
  it('renders the personalized 404 message and valid recovery links', () => {
    const markup = renderToStaticMarkup(React.createElement(NotFound));

    expect(markup).toContain('Error 404');
    expect(markup).toContain('Esta huella se perdió');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/vaccinations"');
  });

  it('renders the runtime error recovery actions', () => {
    const reset = vi.fn();
    const markup = renderToStaticMarkup(React.createElement(ErrorPage, {
      error: new Error('test error'),
      reset
    }));

    expect(markup).toContain('Algo salió mal');
    expect(markup).toContain('La clínica necesita un segundo intento');
    expect(markup).toContain('Intentar de nuevo');
    expect(markup).toContain('href="/"');
  });
});
