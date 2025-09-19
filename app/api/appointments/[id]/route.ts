import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateAppointmentEmailHTML } from '@/lib/email'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
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
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar se o usuário tem permissão para ver este agendamento
    if (session.user.role === 'CLIENTE' && appointment.clientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }
    
    if (session.user.role === 'BARBEIRO' && appointment.barberId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { status, notes, barberId } = body
    
    // Buscar agendamento atual
    const currentAppointment = await prisma.appointment.findUnique({
      where: { id: params.id },
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
    
    if (!currentAppointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar permissões
    const canUpdate = 
      session.user.role === 'ADMIN' ||
      session.user.role === 'BARBEIRO' ||
      (session.user.role === 'CLIENTE' && currentAppointment.clientId === session.user.id)
    
    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }
    
    // Atualizar agendamento
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(barberId && { barberId }),
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
        appointmentId: params.id,
        action: 'updated',
        oldStatus: currentAppointment.status,
        newStatus: status || currentAppointment.status,
        userId: session.user.id,
        notes: notes || 'Agendamento atualizado',
      }
    })
    
    // Enviar email se o status mudou
    if (status && status !== currentAppointment.status) {
      try {
        let emailType: 'confirmation' | 'cancellation' | 'reminder' = 'confirmation'
        
        if (status === 'CANCELADO') {
          emailType = 'cancellation'
        } else if (status === 'CONFIRMADO') {
          emailType = 'confirmation'
        }
        
        const emailHTML = generateAppointmentEmailHTML(emailType, {
          serviceName: currentAppointment.service.name,
          barberName: currentAppointment.barber?.name,
          date: currentAppointment.date.toLocaleDateString('pt-BR'),
          time: currentAppointment.startTime,
          clientName: currentAppointment.client.name,
          totalPrice: currentAppointment.totalPrice,
        })
        
        await sendEmail({
          to: currentAppointment.client.email,
          subject: `Agendamento ${status === 'CANCELADO' ? 'Cancelado' : 'Confirmado'} - Barbearia Elite`,
          html: emailHTML,
        })
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError)
      }
    }
    
    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    // Buscar agendamento
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
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
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar permissões
    const canDelete = 
      session.user.role === 'ADMIN' ||
      (session.user.role === 'CLIENTE' && appointment.clientId === session.user.id)
    
    if (!canDelete) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }
    
    // Verificar se pode cancelar (regra de negócio: só até 2 horas antes)
    const now = new Date()
    const appointmentDate = new Date(appointment.date)
    const timeDiff = appointmentDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)
    
    if (session.user.role === 'CLIENTE' && hoursDiff < 2) {
      return NextResponse.json(
        { error: 'Não é possível cancelar com menos de 2 horas de antecedência' },
        { status: 400 }
      )
    }
    
    // Atualizar status para cancelado
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status: 'CANCELADO' }
    })
    
    // Criar log de auditoria
    await prisma.auditLog.create({
      data: {
        appointmentId: params.id,
        action: 'cancelled',
        oldStatus: appointment.status,
        newStatus: 'CANCELADO',
        userId: session.user.id,
        notes: 'Agendamento cancelado',
      }
    })
    
    // Enviar email de cancelamento
    try {
      const emailHTML = generateAppointmentEmailHTML('cancellation', {
        serviceName: appointment.service.name,
        barberName: appointment.barber?.name,
        date: appointment.date.toLocaleDateString('pt-BR'),
        time: appointment.startTime,
        clientName: appointment.client.name,
        totalPrice: appointment.totalPrice,
      })
      
      await sendEmail({
        to: appointment.client.email,
        subject: 'Agendamento Cancelado - Barbearia Elite',
        html: emailHTML,
      })
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError)
    }
    
    return NextResponse.json({ message: 'Agendamento cancelado com sucesso' })
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
