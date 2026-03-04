// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/errorBoundary';
import { AuthProvider, useAuth } from '@/lib/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'InvoSnap - Professional Invoices in 60 Seconds',
  description: 'Create and send beautiful invoices instantly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}