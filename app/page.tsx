import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scissors, Clock, Star, Users, Calendar, Award } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const services = [
    {
      name: 'Corte Masculino',
      description: 'Corte moderno e estiloso com acabamento perfeito',
      duration: '30 min',
      price: 'R$ 35,00',
      icon: Scissors,
    },
    {
      name: 'Barba Completa',
      description: 'Aparar, modelar e finalizar sua barba',
      duration: '25 min',
      price: 'R$ 25,00',
      icon: Clock,
    },
    {
      name: 'Corte + Barba',
      description: 'Combo completo para um visual impecável',
      duration: '45 min',
      price: 'R$ 50,00',
      icon: Star,
    },
    {
      name: 'Sobrancelha',
      description: 'Design e modelagem das sobrancelhas',
      duration: '15 min',
      price: 'R$ 15,00',
      icon: Award,
    },
  ]

  const features = [
    {
      title: 'Agendamento Online',
      description: 'Reserve seu horário de forma rápida e prática',
      icon: Calendar,
    },
    {
      title: 'Profissionais Qualificados',
      description: 'Barbeiros experientes e especializados',
      icon: Users,
    },
    {
      title: 'Ambiente Moderno',
      description: 'Local confortável e bem equipado',
      icon: Star,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="barber-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sua Barbearia de
              <span className="block barber-text-gradient">Confiança</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Cuidados masculinos de qualidade com profissionais experientes. 
              Agende seu horário online e tenha a melhor experiência.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/servicos">
                <Button size="lg" variant="barber" className="text-lg px-8 py-3">
                  Ver Serviços
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-barber-dark">
                  Fazer Reserva
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a Barbearia Elite?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos os melhores serviços com comodidade e qualidade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-barber-accent rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-barber-dark" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça todos os serviços que oferecemos para cuidar do seu visual
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-barber-accent rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-barber-dark" />
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <Clock className="inline h-4 w-4 mr-1" />
                      {service.duration}
                    </p>
                    <p className="text-xl font-bold text-barber-accent">
                      {service.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/servicos">
              <Button variant="barber" size="lg">
                Ver Todos os Serviços
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-barber-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para um Visual Novo?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Agende seu horário agora mesmo e tenha a melhor experiência em cuidados masculinos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="barber" className="text-lg px-8 py-3">
                Fazer Reserva
              </Button>
            </Link>
            <Link href="/contato">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-barber-dark">
                Entrar em Contato
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
