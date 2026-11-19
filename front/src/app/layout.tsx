import './globals.css';
import { AuthProvider } from '../context/auth-context';
import { Newsreader, Quattrocento } from 'next/font/google';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-newsreader',
  display: 'optional',
});

const quattrocento = Quattrocento({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-quattrocento',
  display: 'optional',
});

export const metadata = {
  title: 'Happy Paws Care Central',
  description: 'Gestión clínica de Happy Paws Veterinary Clinic',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${newsreader.variable} ${quattrocento.variable}`}>
      <head />
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
