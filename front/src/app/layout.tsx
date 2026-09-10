import './globals.css';

export const metadata = {
  title: 'Happy Paws | Vacunaciones',
  description: 'Seguimiento preventivo de pacientes'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=contextual_token,pets,assignment,vaccines" />
      </head>
      <body>{children}</body>
    </html>
  );
}