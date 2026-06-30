import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TRN Publisher',
  description: 'Publicador editorial para crear borradores en WordPress desde TRN Andalucía',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
