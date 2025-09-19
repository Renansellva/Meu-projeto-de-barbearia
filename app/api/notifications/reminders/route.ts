import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateAppointmentEmailHTML } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    // Verificar se é uma chamada autorizada (pode ser de um cron job)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    // Buscar agendamentos para amanhã (lembrete de 24h)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)
    
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: dayAfter,
        },
        status: 'CONFIRMADO',
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
    
    let emailsSent = 0
    let errors = 0
    
    for (const appointment of appointments) {
      try {
        const emailHTML = generateAppointmentEmailHTML('reminder', {
          serviceName: appointment.service.name,
          barberName: appointment.barber?.name,
          date: appointment.date.toLocaleDateString('pt-BR'),
          time: appointment.startTime,
          clientName: appointment.client.name,
          totalPrice: appointment.totalPrice,
        })
        
        const emailResult = await sendEmail({
          to: appointment.client.email,
          subject: 'Lembrete de Agendamento - Barbearia Elite',
          html: emailHTML,
        })
        
        if (emailResult.success) {
          emailsSent++
          
          // Criar log de auditoria
          await prisma.auditLog.create({
            data: {
              appointmentId: appointment.id,
              action: 'reminder_sent',
              notes: 'Lembrete automático enviado',
            }
          })
        } else {
          errors++
        }
      } catch (error) {
        console.error(`Erro ao enviar lembrete para agendamento ${appointment.id}:`, error)
        errors++
      }
    }
    
    return NextResponse.json({
      message: 'Lembretes processados',
      appointmentsFound: appointments.length,
      emailsSent,
      errors,
    })
    
  } catch (error) {
    console.error('Erro ao processar lembretes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
