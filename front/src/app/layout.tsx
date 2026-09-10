import './globals.css';

export const metadata = {
  title: 'Happy Paws | Vacunaciones',
  description: 'Seguimiento preventivo de pacientes'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}