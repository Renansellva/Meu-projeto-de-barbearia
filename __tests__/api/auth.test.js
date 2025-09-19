const request = require('supertest')
const { createMocks } = require('node-mocks-http')
const { POST } = require('../../app/api/auth/register/route')

// Mock do Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock do bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}))

const { prisma } = require('../../lib/prisma')
const bcrypt = require('bcryptjs')

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/register', () => {
    it('deve criar usuário com sucesso', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'João Silva',
        email: 'joao@email.com',
        role: 'CLIENTE',
        createdAt: new Date(),
      }

      prisma.user.findUnique.mockResolvedValue(null) // Email não existe
      bcrypt.hash.mockResolvedValue('hashed-password')
      prisma.user.create.mockResolvedValue(mockUser)

      const { req } = createMocks({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '(11) 99999-9999',
          password: '123456',
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe('Usuário criado com sucesso')
      expect(data.user).toEqual(mockUser)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '(11) 99999-9999',
          password: 'hashed-password',
          role: 'CLIENTE',
        },
        select: expect.any(Object),
      })
    })

    it('deve retornar erro se email já existe', async () => {
      const existingUser = {
        id: 'existing-user',
        email: 'joao@email.com',
      }

      prisma.user.findUnique.mockResolvedValue(existingUser)

      const { req } = createMocks({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          name: 'João Silva',
          email: 'joao@email.com',
          password: '123456',
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email já está em uso')
    })

    it('deve retornar erro para dados inválidos', async () => {
      const { req } = createMocks({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          name: 'J', // Nome muito curto
          email: 'email-invalido', // Email inválido
          password: '123', // Senha muito curta
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it('deve retornar erro para senha muito curta', async () => {
      const { req } = createMocks({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          name: 'João Silva',
          email: 'joao@email.com',
          password: '123', // Senha muito curta
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Senha deve ter pelo menos 6 caracteres')
    })

    it('deve retornar erro para email inválido', async () => {
      const { req } = createMocks({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          name: 'João Silva',
          email: 'email-invalido',
          password: '123456',
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email inválido')
    })
  })
})
