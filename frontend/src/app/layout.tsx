import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ClientLayout } from './ClientLayout';

export const metadata: Metadata = {
  title: 'AI Emergency Government Navigator | Government of India',
  description: 'Official Government of India AI-powered emergency assistance platform. SOS support, disaster response, citizen safety services, and government procedures.',
  keywords: 'emergency, SOS, government, India, disaster, women safety, first aid, missing person',
  robots: 'index, follow',
  openGraph: {
    title: 'AI Emergency Government Navigator',
    description: 'Official Government of India emergency assistance platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
