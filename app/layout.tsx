import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { FloatingButton } from '@/components/ui/floating-button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Barbearia Elite - Sistema de Reservas',
  description: 'Sistema completo de reservas para barbearia com agendamento online',
  keywords: 'barbearia, agendamento, reservas, corte, barba',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <FloatingButton />
        </Providers>
      </body>
    </html>
  )
}
