'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, X } from 'lucide-react'
import Link from 'next/link'

export function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botão flutuante */}
      <div className="floating-button">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          variant="barber"
          className="rounded-full w-14 h-14 shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
        </Button>
      </div>

      {/* Menu flutuante */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50">
          <Card className="w-64 shadow-xl">
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Agendar Serviço</h3>
                <p className="text-sm text-gray-600">
                  Escolha uma opção para agendar seu horário
                </p>
                
                <div className="space-y-2">
                  <Link href="/servicos" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Serviços
                    </Button>
                  </Link>
                  
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    <Button variant="barber" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Fazer Reserva
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay para fechar o menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
