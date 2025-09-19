import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateAppointmentEmailHTML } from '@/lib/email'
import { z } from 'zod'

const sendNotificationSchema = z.object({
  appointmentId: z.string().min(1, 'ID do agendamento é obrigatório'),
  type: z.enum(['confirmation', 'cancellation', 'reminder', 'custom']),
  customMessage: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = sendNotificationSchema.parse(body)
    
    // Buscar agendamento
    const appointment = await prisma.appointment.findUnique({
      where: { id: validatedData.appointmentId },
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
    
    let emailHTML: string
    let subject: string
    
    if (validatedData.type === 'custom' && validatedData.customMessage) {
      // Email customizado
      emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Mensagem da Barbearia Elite</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: #d4af37; padding: 20px; text-align: center; }
            .content { background: #f5f5f5; padding: 30px; }
            .footer { background: #2d2d2d; color: white; padding: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Barbearia Elite</h1>
            </div>
            <div class="content">
              <h2>Mensagem Importante</h2>
              <p>Olá ${appointment.client.name},</p>
              <p>${validatedData.customMessage}</p>
              <p>Atenciosamente,<br>Equipe Barbearia Elite</p>
            </div>
            <div class="footer">
              <p>${process.env.BUSINESS_ADDRESS}</p>
              <p>Telefone: ${process.env.BUSINESS_PHONE}</p>
            </div>
          </div>
        </body>
        </html>
      `
      subject = 'Mensagem da Barbearia Elite'
    } else {
      // Email baseado no tipo
      emailHTML = generateAppointmentEmailHTML(validatedData.type, {
        serviceName: appointment.service.name,
        barberName: appointment.barber?.name,
        date: appointment.date.toLocaleDateString('pt-BR'),
        time: appointment.startTime,
        clientName: appointment.client.name,
        totalPrice: appointment.totalPrice,
      })
      
      switch (validatedData.type) {
        case 'confirmation':
          subject = 'Agendamento Confirmado - Barbearia Elite'
          break
        case 'cancellation':
          subject = 'Agendamento Cancelado - Barbearia Elite'
          break
        case 'reminder':
          subject = 'Lembrete de Agendamento - Barbearia Elite'
          break
        default:
          subject = 'Agendamento - Barbearia Elite'
      }
    }
    
    // Enviar email
    const emailResult = await sendEmail({
      to: appointment.client.email,
      subject,
      html: emailHTML,
    })
    
    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Erro ao enviar email' },
        { status: 500 }
      )
    }
    
    // Criar log de auditoria
    await prisma.auditLog.create({
      data: {
        appointmentId: appointment.id,
        action: 'email_sent',
        userId: session.user.id,
        notes: `Email ${validatedData.type} enviado`,
      }
    })
    
    return NextResponse.json({
      message: 'Email enviado com sucesso',
      type: validatedData.type,
      recipient: appointment.client.email,
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    console.error('Erro ao enviar notificação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
