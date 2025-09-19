import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail, generateAppointmentEmailHTML } from '@/lib/email'

const createAppointmentSchema = z.object({
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  barberId: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  startTime: z.string().min(1, 'Horário é obrigatório'),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const barberId = searchParams.get('barberId')
    const date = searchParams.get('date')
    
    const where: any = {}
    
    // Se for cliente, só mostra seus agendamentos
    if (session.user.role === 'CLIENTE') {
      where.clientId = session.user.id
    }
    
    // Se for barbeiro, mostra agendamentos dele
    if (session.user.role === 'BARBEIRO') {
      where.barberId = session.user.id
    }
    
    // Filtros opcionais
    if (status) {
      where.status = status
    }
    
    if (barberId) {
      where.barberId = barberId
    }
    
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      where.date = {
        gte: startDate,
        lt: endDate,
      }
    }
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        barber: {
          select: {
            id: true,
            name: true,
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
          }
        }
      },
      orderBy: { date: 'asc' }
    })
    
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Validar dados
    const validatedData = createAppointmentSchema.parse(body)
    
    // Buscar serviço para obter duração e preço
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId }
    })
    
    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      )
    }
    
    // Calcular horário de fim
    const startTime = validatedData.startTime
    const [hours, minutes] = startTime.split(':').map(Number)
    const startDateTime = new Date(validatedData.date)
    startDateTime.setHours(hours, minutes, 0, 0)
    
    const endDateTime = new Date(startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + service.duration)
    
    const endTime = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`
    
    // Verificar se já existe agendamento no mesmo horário
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: startDateTime,
        startTime: validatedData.startTime,
        barberId: validatedData.barberId || null,
        status: {
          not: 'CANCELADO'
        }
      }
    })
    
    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Já existe um agendamento neste horário' },
        { status: 400 }
      )
    }
    
    // Criar agendamento
    const appointment = await prisma.appointment.create({
      data: {
        clientId: session.user.id,
        barberId: validatedData.barberId,
        serviceId: validatedData.serviceId,
        date: startDateTime,
        startTime: validatedData.startTime,
        endTime,
        notes: validatedData.notes,
        totalPrice: service.price,
        status: 'PENDENTE',
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          }
        },
        barber: {
          select: {
            name: true,
          }
        },
        service: {
          select: {
            name: true,
          }
        }
      }
    })
    
    // Criar log de auditoria
    await prisma.auditLog.create({
      data: {
        appointmentId: appointment.id,
        action: 'created',
        userId: session.user.id,
        notes: 'Agendamento criado pelo cliente',
      }
    })
    
    // Enviar email de confirmação
    try {
      const emailHTML = generateAppointmentEmailHTML('confirmation', {
        serviceName: service.name,
        barberName: appointment.barber?.name,
        date: new Date(validatedData.date).toLocaleDateString('pt-BR'),
        time: validatedData.startTime,
        clientName: appointment.client.name,
        totalPrice: service.price,
      })
      
      await sendEmail({
        to: appointment.client.email,
        subject: 'Agendamento Confirmado - Barbearia Elite',
        html: emailHTML,
      })
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError)
      // Não falha o agendamento se o email falhar
    }
    
    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
