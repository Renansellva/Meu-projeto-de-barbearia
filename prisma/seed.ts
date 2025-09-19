import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.auditLog.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.barber.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Dados antigos removidos')

  // Criar usuários
  const hashedPassword = await bcrypt.hash('123456', 12)

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@barbeariaelite.com',
      name: 'Administrador',
      password: hashedPassword,
      role: UserRole.ADMIN,
      phone: '(11) 99999-0001',
    }
  })

  // Barbeiros
  const barbeiro1 = await prisma.user.create({
    data: {
      email: 'joao@barbeariaelite.com',
      name: 'João Silva',
      password: hashedPassword,
      role: UserRole.BARBEIRO,
      phone: '(11) 99999-0002',
    }
  })

  const barbeiro2 = await prisma.user.create({
    data: {
      email: 'pedro@barbeariaelite.com',
      name: 'Pedro Santos',
      password: hashedPassword,
      role: UserRole.BARBEIRO,
      phone: '(11) 99999-0003',
    }
  })

  // Clientes
  const cliente1 = await prisma.user.create({
    data: {
      email: 'cliente1@email.com',
      name: 'Carlos Oliveira',
      password: hashedPassword,
      role: UserRole.CLIENTE,
      phone: '(11) 99999-0004',
    }
  })

  const cliente2 = await prisma.user.create({
    data: {
      email: 'cliente2@email.com',
      name: 'Roberto Silva',
      password: hashedPassword,
      role: UserRole.CLIENTE,
      phone: '(11) 99999-0005',
    }
  })

  console.log('👥 Usuários criados')

  // Criar barbeiros
  const barber1 = await prisma.barber.create({
    data: {
      userId: barbeiro1.id,
      specialties: ['Corte Clássico', 'Barba', 'Bigode'],
      bio: 'Barbeiro com 8 anos de experiência, especializado em cortes clássicos e barbas.',
      rating: 4.8,
    }
  })

  const barber2 = await prisma.barber.create({
    data: {
      userId: barbeiro2.id,
      specialties: ['Corte Moderno', 'Barba Desenhada', 'Sobrancelha'],
      bio: 'Especialista em cortes modernos e barbas desenhadas. 6 anos de experiência.',
      rating: 4.9,
    }
  })

  console.log('✂️ Barbeiros criados')

  // Criar serviços
  const servicos = [
    {
      name: 'Corte Masculino',
      description: 'Corte moderno e estiloso com acabamento perfeito',
      duration: 30,
      price: 35.00,
    },
    {
      name: 'Barba Completa',
      description: 'Aparar, modelar e finalizar sua barba',
      duration: 25,
      price: 25.00,
    },
    {
      name: 'Corte + Barba',
      description: 'Combo completo para um visual impecável',
      duration: 45,
      price: 50.00,
    },
    {
      name: 'Sobrancelha',
      description: 'Design e modelagem das sobrancelhas',
      duration: 15,
      price: 15.00,
    },
    {
      name: 'Corte Infantil',
      description: 'Corte especial para crianças',
      duration: 20,
      price: 20.00,
    },
    {
      name: 'Tratamento Capilar',
      description: 'Hidratação profunda e revitalização',
      duration: 60,
      price: 80.00,
    },
  ]

  const services = []
  for (const servico of servicos) {
    const service = await prisma.service.create({
      data: servico
    })
    services.push(service)
  }

  console.log('🛠️ Serviços criados')

  // Criar disponibilidade dos barbeiros
  const diasSemana = [
    { day: 1, name: 'Segunda' },
    { day: 2, name: 'Terça' },
    { day: 3, name: 'Quarta' },
    { day: 4, name: 'Quinta' },
    { day: 5, name: 'Sexta' },
    { day: 6, name: 'Sábado' },
  ]

  for (const barber of [barber1, barber2]) {
    for (const dia of diasSemana) {
      await prisma.availability.create({
        data: {
          barberId: barber.id,
          dayOfWeek: dia.day,
          startTime: '08:00',
          endTime: dia.day === 6 ? '16:00' : '18:00', // Sábado até 16h
        }
      })
    }
  }

  console.log('📅 Disponibilidade criada')

  // Criar alguns agendamentos de exemplo
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(hoje.getDate() + 1)

  const agendamentos = [
    {
      clientId: cliente1.id,
      barberId: barbeiro1.id,
      serviceId: services[0].id, // Corte Masculino
      date: amanha,
      startTime: '09:00',
      endTime: '09:30',
      status: AppointmentStatus.CONFIRMADO,
      notes: 'Primeira vez na barbearia',
      totalPrice: 35.00,
    },
    {
      clientId: cliente2.id,
      barberId: barbeiro2.id,
      serviceId: services[2].id, // Corte + Barba
      date: amanha,
      startTime: '10:00',
      endTime: '10:45',
      status: AppointmentStatus.PENDENTE,
      notes: 'Cliente preferencial',
      totalPrice: 50.00,
    },
    {
      clientId: cliente1.id,
      barberId: barbeiro1.id,
      serviceId: services[1].id, // Barba Completa
      date: new Date(amanha.getTime() + 24 * 60 * 60 * 1000), // Depois de amanhã
      startTime: '14:00',
      endTime: '14:25',
      status: AppointmentStatus.CONFIRMADO,
      totalPrice: 25.00,
    },
  ]

  for (const agendamento of agendamentos) {
    const appointment = await prisma.appointment.create({
      data: agendamento
    })

    // Criar log de auditoria
    await prisma.auditLog.create({
      data: {
        appointmentId: appointment.id,
        action: 'created',
        userId: agendamento.clientId,
        notes: 'Agendamento criado via seed',
      }
    })
  }

  console.log('📝 Agendamentos de exemplo criados')

  // Criar configurações do sistema
  const configuracoes = [
    {
      key: 'business_name',
      value: 'Barbearia Elite',
      type: 'string',
    },
    {
      key: 'business_phone',
      value: '(11) 99999-9999',
      type: 'string',
    },
    {
      key: 'business_email',
      value: 'contato@barbeariaelite.com',
      type: 'string',
    },
    {
      key: 'business_address',
      value: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      type: 'string',
    },
    {
      key: 'cancellation_hours_limit',
      value: '2',
      type: 'number',
    },
    {
      key: 'appointment_interval_minutes',
      value: '30',
      type: 'number',
    },
  ]

  for (const config of configuracoes) {
    await prisma.systemConfig.create({
      data: config
    })
  }

  console.log('⚙️ Configurações do sistema criadas')

  console.log('✅ Seed concluído com sucesso!')
  console.log('\n📋 Credenciais de acesso:')
  console.log('👑 Admin: admin@barbeariaelite.com / 123456')
  console.log('✂️ Barbeiro 1: joao@barbeariaelite.com / 123456')
  console.log('✂️ Barbeiro 2: pedro@barbeariaelite.com / 123456')
  console.log('👤 Cliente 1: cliente1@email.com / 123456')
  console.log('👤 Cliente 2: cliente2@email.com / 123456')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
