const request = require('supertest')
const { createMocks } = require('node-mocks-http')
const { GET, POST } = require('../../app/api/appointments/route')

// Mock do Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    appointment: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    service: {
      findUnique: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}))

// Mock do NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock do email
jest.mock('../../lib/email', () => ({
  sendEmail: jest.fn(),
  generateAppointmentEmailHTML: jest.fn(),
}))

const { prisma } = require('../../lib/prisma')
const { getServerSession } = require('next-auth')

describe('/api/appointments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/appointments', () => {
    it('deve retornar agendamentos para cliente autenticado', async () => {
      const mockSession = {
        user: {
          id: 'client-1',
          role: 'CLIENTE',
        },
      }

      const mockAppointments = [
        {
          id: 'appointment-1',
          clientId: 'client-1',
          serviceId: 'service-1',
          date: new Date('2024-01-15T10:00:00Z'),
          startTime: '10:00',
          endTime: '10:30',
          status: 'CONFIRMADO',
          totalPrice: 35.00,
          client: { id: 'client-1', name: 'João Silva', email: 'joao@email.com' },
          service: { id: 'service-1', name: 'Corte Masculino', duration: 30, price: 35.00 },
        },
      ]

      getServerSession.mockResolvedValue(mockSession)
      prisma.appointment.findMany.mockResolvedValue(mockAppointments)

      const { req } = createMocks({
        method: 'GET',
        url: '/api/appointments',
      })

      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockAppointments)
      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: { clientId: 'client-1' },
        include: expect.any(Object),
        orderBy: { date: 'asc' },
      })
    })

    it('deve retornar erro 401 para usuário não autenticado', async () => {
      getServerSession.mockResolvedValue(null)

      const { req } = createMocks({
        method: 'GET',
        url: '/api/appointments',
      })

      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Não autorizado')
    })
  })

  describe('POST /api/appointments', () => {
    it('deve criar agendamento com sucesso', async () => {
      const mockSession = {
        user: {
          id: 'client-1',
          role: 'CLIENTE',
        },
      }

      const mockService = {
        id: 'service-1',
        name: 'Corte Masculino',
        duration: 30,
        price: 35.00,
      }

      const mockAppointment = {
        id: 'appointment-1',
        clientId: 'client-1',
        serviceId: 'service-1',
        date: new Date('2024-01-15T10:00:00Z'),
        startTime: '10:00',
        endTime: '10:30',
        status: 'PENDENTE',
        totalPrice: 35.00,
        client: { name: 'João Silva', email: 'joao@email.com' },
        service: { name: 'Corte Masculino' },
      }

      getServerSession.mockResolvedValue(mockSession)
      prisma.service.findUnique.mockResolvedValue(mockService)
      prisma.appointment.findFirst.mockResolvedValue(null) // Nenhum conflito
      prisma.appointment.create.mockResolvedValue(mockAppointment)
      prisma.auditLog.create.mockResolvedValue({})

      const { req } = createMocks({
        method: 'POST',
        url: '/api/appointments',
        body: {
          serviceId: 'service-1',
          date: '2024-01-15',
          startTime: '10:00',
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockAppointment)
      expect(prisma.appointment.create).toHaveBeenCalled()
      expect(prisma.auditLog.create).toHaveBeenCalled()
    })

    it('deve retornar erro ao tentar agendar em horário ocupado', async () => {
      const mockSession = {
        user: {
          id: 'client-1',
          role: 'CLIENTE',
        },
      }

      const mockService = {
        id: 'service-1',
        name: 'Corte Masculino',
        duration: 30,
        price: 35.00,
      }

      const mockExistingAppointment = {
        id: 'existing-appointment',
        startTime: '10:00',
        endTime: '10:30',
      }

      getServerSession.mockResolvedValue(mockSession)
      prisma.service.findUnique.mockResolvedValue(mockService)
      prisma.appointment.findFirst.mockResolvedValue(mockExistingAppointment)

      const { req } = createMocks({
        method: 'POST',
        url: '/api/appointments',
        body: {
          serviceId: 'service-1',
          date: '2024-01-15',
          startTime: '10:00',
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Já existe um agendamento neste horário')
    })

    it('deve retornar erro para dados inválidos', async () => {
      const mockSession = {
        user: {
          id: 'client-1',
          role: 'CLIENTE',
        },
      }

      getServerSession.mockResolvedValue(mockSession)

      const { req } = createMocks({
        method: 'POST',
        url: '/api/appointments',
        body: {
          // serviceId ausente
          date: '2024-01-15',
          startTime: '10:00',
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Serviço é obrigatório')
    })
  })
})
