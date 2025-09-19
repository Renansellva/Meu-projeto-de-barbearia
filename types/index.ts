import { UserRole, AppointmentStatus } from '@prisma/client'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Barber {
  id: string
  userId: string
  user: User
  specialties: string[]
  bio?: string
  rating: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Availability {
  id: string
  barberId: string
  barber: Barber
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  clientId: string
  client: User
  barberId?: string
  barber?: User
  serviceId: string
  service: Service
  date: Date
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  id: string
  appointmentId: string
  appointment: Appointment
  action: string
  oldStatus?: string
  newStatus?: string
  userId?: string
  notes?: string
  createdAt: Date
}

export interface SystemConfig {
  id: string
  key: string
  value: string
  type: string
  createdAt: Date
  updatedAt: Date
}

// DTOs para APIs
export interface CreateAppointmentDTO {
  serviceId: string
  barberId?: string
  date: string
  startTime: string
  notes?: string
}

export interface UpdateAppointmentDTO {
  status?: AppointmentStatus
  notes?: string
  barberId?: string
}

export interface CreateServiceDTO {
  name: string
  description?: string
  duration: number
  price: number
}

export interface UpdateServiceDTO {
  name?: string
  description?: string
  duration?: number
  price?: number
  isActive?: boolean
}

export interface CreateBarberDTO {
  userId: string
  specialties: string[]
  bio?: string
}

export interface UpdateBarberDTO {
  specialties?: string[]
  bio?: string
  isActive?: boolean
}

export interface TimeSlot {
  time: string
  available: boolean
  barberId?: string
  barberName?: string
}

export interface AvailableSlotsResponse {
  date: string
  slots: TimeSlot[]
}

// Extensão do NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
    }
  }

  interface User {
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
  }
}
