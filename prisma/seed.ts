import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes em uma ordem segura para evitar erros de constraint
  await prisma.auditLog.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.service.deleteMany()
  await prisma.barber.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Dados antigos removidos')

  // Criar usuários
  const hashedPassword = await bcrypt.hash('123456', 10)

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@barbeariaelite.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })

  // Barbeiros
  const barbeiro1 = await prisma.user.create({
    data: {
      email: 'joao@barbeariaelite.com',
      name: 'João Silva',
      password: hashedPassword,
      role: 'BARBER',
    }
  })

  const barbeiro2 = await prisma.user.create({
    data: {
      email: 'pedro@barbeariaelite.com',
      name: 'Pedro Santos',
      password: hashedPassword,
      role: 'BARBER',
    }
  })

  // Clientes
  const cliente1 = await prisma.user.create({
    data: {
      email: 'cliente1@email.com',
      name: 'Carlos Oliveira',
      password: hashedPassword,
      role: 'CLIENT',
    }
  })

  const cliente2 = await prisma.user.create({
    data: {
      email: 'cliente2@email.com',
      name: 'Roberto Silva',
      password: hashedPassword,
      role: 'CLIENT',
    }
  })

  console.log('👥 Usuários criados')

  // Criar perfil dos barbeiros
  const barber1Profile = await prisma.barber.create({
    data: {
      userId: barbeiro1.id,
      specialties: ['Corte Clássico', 'Barba', 'Bigode'],
      bio: 'Barbeiro com 8 anos de experiência, especializado em cortes clássicos e barbas.',
      rating: 4.8,
    }
  })

  const barber2Profile = await prisma.barber.create({
    data: {
      userId: barbeiro2.id,
      specialties: ['Corte Moderno', 'Barba Desenhada', 'Sobrancelha'],
      bio: 'Especialista em cortes modernos e barbas desenhadas. 6 anos de experiência.',
      rating: 4.9,
    }
  })

  console.log('✂️ Perfis de Barbeiros criados')

  // Criar serviços
  const servicosData = [
    { name: 'Corte Masculino', description: 'Corte moderno e estiloso', duration: 30, price: 35.00 },
    { name: 'Barba Completa', description: 'Aparar, modelar e finalizar', duration: 25, price: 25.00 },
    { name: 'Corte + Barba', description: 'Combo completo para um visual impecável', duration: 45, price: 50.00 },
  ]
  
  const services = await prisma.service.createManyAndReturn({
    data: servicosData,
  })

  console.log('🛠️ Serviços criados')

  // Criar disponibilidade dos barbeiros
  const diasSemana = [1, 2, 3, 4, 5, 6]; // 1=Seg, 6=Sab
  for (const barber of [barber1Profile, barber2Profile]) {
    for (const dia of diasSemana) {
      await prisma.availability.create({
        data: {
          barberId: barber.id,
          userId: barber.userId,
          dayOfWeek: dia,
          startTime: '08:00',
          endTime: dia === 6 ? '16:00' : '18:00',
        }
      })
    }
  }

  console.log('📅 Disponibilidade criada')

  // Criar agendamentos de exemplo
  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)
  amanha.setHours(10, 0, 0, 0) // Amanhã às 10:00

  await prisma.appointment.create({
    data: {
      clientId: cliente1.id,
      barberId: barber1Profile.id,
      serviceId: services[0].id,
      date: amanha,
      status: 'CONFIRMED',
      notes: 'Primeira vez na barbearia',
    }
  })

  console.log('📝 Agendamentos de exemplo criados')

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