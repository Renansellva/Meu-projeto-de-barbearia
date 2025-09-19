'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, Scissors, User, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'

interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
}

interface Barber {
  id: string
  name: string
}

interface TimeSlot {
  time: string
  available: boolean
  barberId?: string
  barberName?: string
}

export default function AgendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Serviço, 2: Barbeiro, 3: Data/Hora, 4: Confirmação

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }

    fetchServices()
    fetchBarbers()
  }, [session, status, router])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?active=true')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
    }
  }

  const fetchBarbers = async () => {
    try {
      const response = await fetch('/api/barbers')
      if (response.ok) {
        const data = await response.json()
        setBarbers(data)
      }
    } catch (error) {
      console.error('Erro ao carregar barbeiros:', error)
    }
  }

  const fetchTimeSlots = async () => {
    if (!selectedService || !selectedDate) return

    try {
      const params = new URLSearchParams({
        date: selectedDate,
        serviceId: selectedService.id,
        ...(selectedBarber && { barberId: selectedBarber })
      })

      const response = await fetch(`/api/appointments/availability?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTimeSlots(data.slots)
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
    }
  }

  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchTimeSlots()
    }
  }, [selectedService, selectedDate, selectedBarber])

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleBarberSelect = (barberId: string) => {
    setSelectedBarber(barberId)
    setStep(3)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(4)
  }

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return

    setLoading(true)
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          barberId: selectedBarber || undefined,
          date: selectedDate,
          startTime: selectedTime,
          notes: notes || undefined,
        }),
      })

      if (response.ok) {
        alert('Agendamento criado com sucesso!')
        router.push('/dashboard')
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao criar agendamento')
      }
    } catch (error) {
      alert('Erro ao criar agendamento')
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30) // 30 dias no futuro
    return maxDate.toISOString().split('T')[0]
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-barber-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Novo Agendamento
            </h1>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-barber-accent text-barber-dark' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-barber-accent' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scissors className="h-5 w-5 mr-2" />
                Escolha o Serviço
              </CardTitle>
              <CardDescription>
                Selecione o serviço que deseja agendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card 
                    key={service.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <Clock className="inline h-4 w-4 mr-1" />
                          {service.duration} min
                        </div>
                        <div className="font-bold text-barber-accent">
                          {formatCurrency(service.price)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Barber */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Escolha o Barbeiro
              </CardTitle>
              <CardDescription>
                Selecione um barbeiro específico ou deixe em branco para qualquer disponível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  variant={selectedBarber === '' ? 'barber' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleBarberSelect('')}
                >
                  Qualquer barbeiro disponível
                </Button>
                
                {barbers.map((barber) => (
                  <Button
                    key={barber.id}
                    variant={selectedBarber === barber.id ? 'barber' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleBarberSelect(barber.id)}
                  >
                    {barber.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Date and Time */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Escolha a Data
                </CardTitle>
                <CardDescription>
                  Selecione o dia para o agendamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  min={getMinDate()}
                  max={getMaxDate()}
                  value={selectedDate}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Time Selection */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Escolha o Horário
                  </CardTitle>
                  <CardDescription>
                    Horários disponíveis para {formatDate(new Date(selectedDate))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? 'barber' : 'outline'}
                        size="sm"
                        disabled={!slot.available}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        className="text-xs"
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                  
                  {timeSlots.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum horário disponível para esta data
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                Confirmação do Agendamento
              </CardTitle>
              <CardDescription>
                Revise os detalhes antes de confirmar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Service Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Detalhes do Serviço</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Serviço:</span>
                      <p className="font-medium">{selectedService?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duração:</span>
                      <p className="font-medium">{selectedService?.duration} minutos</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Preço:</span>
                      <p className="font-medium text-barber-accent">
                        {selectedService && formatCurrency(selectedService.price)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Barbeiro:</span>
                      <p className="font-medium">
                        {selectedBarber 
                          ? barbers.find(b => b.id === selectedBarber)?.name 
                          : 'Qualquer disponível'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Data e Horário</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Data:</span>
                      <p className="font-medium">{formatDate(new Date(selectedDate))}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Horário:</span>
                      <p className="font-medium">{selectedTime}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Alguma observação especial para o barbeiro?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-barber-accent focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1"
                    variant="barber"
                  >
                    {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
