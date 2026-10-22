import type { ReactNode } from 'react';

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      HP
    </span>
  );
}

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} aria-hidden="true">
      {name}
    </span>
  );
}

export function StatusBadge({ label, tone }: { label: ReactNode; tone: string }) {
  return <span className={`status status-${tone}`}>{label}</span>;
}
