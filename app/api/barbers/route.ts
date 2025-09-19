import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const barbers = await prisma.user.findMany({
      where: { 
        role: 'BARBEIRO'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        barber: {
          select: {
            specialties: true,
            bio: true,
            rating: true,
            isActive: true,
          }
        }
      }
    })
    
    return NextResponse.json(barbers)
  } catch (error) {
    console.error('Erro ao buscar barbeiros:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
