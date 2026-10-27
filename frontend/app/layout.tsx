import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crossrule — Shared rules. Independent judgment.',
  description: 'The social space where communities jointly govern discussions and resolve disputes through GenLayer consensus.'
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
