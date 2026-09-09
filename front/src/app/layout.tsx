import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Happy Paws Care Central', description: 'Gestion clinica veterinaria' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
