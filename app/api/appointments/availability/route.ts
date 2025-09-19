import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTimeSlots, addMinutes } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')
    const barberId = searchParams.get('barberId')
    
    if (!date || !serviceId) {
      return NextResponse.json(
        { error: 'Data e serviço são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Buscar serviço para obter duração
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })
    
    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      )
    }
    
    // Buscar barbeiros disponíveis
    let barbers = []
    if (barberId) {
      // Barbeiro específico
      const barber = await prisma.user.findUnique({
        where: { id: barberId, role: 'BARBEIRO' }
      })
      if (barber) {
        barbers = [barber]
      }
    } else {
      // Todos os barbeiros ativos
      barbers = await prisma.user.findMany({
        where: { role: 'BARBEIRO' }
      })
    }
    
    if (barbers.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum barbeiro disponível' },
        { status: 404 }
      )
    }
    
    // Buscar disponibilidade dos barbeiros
    const dayOfWeek = new Date(date).getDay()
    const availability = await prisma.availability.findMany({
      where: {
        barberId: { in: barbers.map(b => b.id) },
        dayOfWeek,
        isActive: true,
      }
    })
    
    // Buscar agendamentos existentes para a data
    const startDate = new Date(date)
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 1)
    
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
        status: {
          not: 'CANCELADO'
        },
        ...(barberId && { barberId })
      },
      select: {
        startTime: true,
        endTime: true,
        barberId: true,
      }
    })
    
    // Gerar slots de tempo disponíveis
    const availableSlots = []
    
    for (const barber of barbers) {
      const barberAvailability = availability.find(a => a.barberId === barber.id)
      
      if (!barberAvailability) {
        continue
      }
      
      // Gerar slots de 30 em 30 minutos
      const timeSlots = getTimeSlots(
        barberAvailability.startTime,
        barberAvailability.endTime,
        30
      )
      
      for (const timeSlot of timeSlots) {
        // Verificar se o serviço cabe no horário
        const endTime = addMinutes(timeSlot, service.duration)
        
        if (endTime > barberAvailability.endTime) {
          continue
        }
        
        // Verificar se já existe agendamento neste horário
        const hasConflict = existingAppointments.some(appointment => {
          if (appointment.barberId !== barber.id) {
            return false
          }
          
          const appointmentStart = appointment.startTime
          const appointmentEnd = appointment.endTime
          
          // Verificar sobreposição de horários
          return (
            (timeSlot >= appointmentStart && timeSlot < appointmentEnd) ||
            (endTime > appointmentStart && endTime <= appointmentEnd) ||
            (timeSlot <= appointmentStart && endTime >= appointmentEnd)
          )
        })
        
        if (!hasConflict) {
          availableSlots.push({
            time: timeSlot,
            available: true,
            barberId: barber.id,
            barberName: barber.name,
          })
        }
      }
    }
    
    // Ordenar por horário
    availableSlots.sort((a, b) => a.time.localeCompare(b.time))
    
    return NextResponse.json({
      date,
      serviceId,
      serviceName: service.name,
      serviceDuration: service.duration,
      slots: availableSlots,
    })
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
