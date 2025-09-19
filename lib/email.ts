import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailData) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.BUSINESS_NAME}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    })

    console.log('Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}

export function generateAppointmentEmailHTML(
  type: 'confirmation' | 'cancellation' | 'reminder',
  appointment: {
    serviceName: string
    barberName?: string
    date: string
    time: string
    clientName: string
    totalPrice: number
  }
) {
  const { serviceName, barberName, date, time, clientName, totalPrice } = appointment

  const getSubject = () => {
    switch (type) {
      case 'confirmation':
        return 'Agendamento Confirmado - Barbearia Elite'
      case 'cancellation':
        return 'Agendamento Cancelado - Barbearia Elite'
      case 'reminder':
        return 'Lembrete de Agendamento - Barbearia Elite'
      default:
        return 'Agendamento - Barbearia Elite'
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'confirmation':
        return 'Agendamento Confirmado!'
      case 'cancellation':
        return 'Agendamento Cancelado'
      case 'reminder':
        return 'Lembrete de Agendamento'
      default:
        return 'Agendamento'
    }
  }

  const getMessage = () => {
    switch (type) {
      case 'confirmation':
        return 'Seu agendamento foi confirmado com sucesso!'
      case 'cancellation':
        return 'Seu agendamento foi cancelado.'
      case 'reminder':
        return 'Este é um lembrete do seu agendamento.'
      default:
        return 'Informações do seu agendamento.'
    }
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${getSubject()}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: #d4af37; padding: 20px; text-align: center; }
        .content { background: #f5f5f5; padding: 30px; }
        .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #2d2d2d; color: white; padding: 20px; text-align: center; }
        .button { background: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Barbearia Elite</h1>
        </div>
        
        <div class="content">
          <h2>${getTitle()}</h2>
          <p>Olá ${clientName},</p>
          <p>${getMessage()}</p>
          
          <div class="appointment-details">
            <h3>Detalhes do Agendamento:</h3>
            <p><strong>Serviço:</strong> ${serviceName}</p>
            ${barberName ? `<p><strong>Barbeiro:</strong> ${barberName}</p>` : ''}
            <p><strong>Data:</strong> ${date}</p>
            <p><strong>Horário:</strong> ${time}</p>
            <p><strong>Valor:</strong> R$ ${totalPrice.toFixed(2)}</p>
          </div>
          
          <p>Se você tiver alguma dúvida, entre em contato conosco.</p>
          
          <p>Atenciosamente,<br>Equipe Barbearia Elite</p>
        </div>
        
        <div class="footer">
          <p>${process.env.BUSINESS_ADDRESS}</p>
          <p>Telefone: ${process.env.BUSINESS_PHONE}</p>
          <p>Email: ${process.env.BUSINESS_EMAIL}</p>
        </div>
      </div>
    </body>
    </html>
  `
}
