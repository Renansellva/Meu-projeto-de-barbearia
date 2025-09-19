import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scissors, Clock, Star, Award, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default function ServicosPage() {
  const services = [
    {
      id: 1,
      name: 'Corte Masculino',
      description: 'Corte moderno e estiloso com acabamento perfeito. Inclui lavagem, corte, finalização e dicas de cuidado.',
      duration: 30,
      price: 35.00,
      features: ['Lavagem com shampoo profissional', 'Corte personalizado', 'Finalização com produtos premium', 'Dicas de manutenção'],
      icon: Scissors,
      popular: true,
    },
    {
      id: 2,
      name: 'Barba Completa',
      description: 'Aparar, modelar e finalizar sua barba com técnicas profissionais para um visual impecável.',
      duration: 25,
      price: 25.00,
      features: ['Aparar e modelar', 'Design personalizado', 'Finalização com óleo', 'Hidratação da pele'],
      icon: Clock,
      popular: false,
    },
    {
      id: 3,
      name: 'Corte + Barba',
      description: 'Combo completo para um visual renovado. Corte de cabelo e barba em uma única sessão.',
      duration: 45,
      price: 50.00,
      features: ['Corte de cabelo completo', 'Barba completa', 'Economia no combo', 'Visual renovado'],
      icon: Star,
      popular: true,
    },
    {
      id: 4,
      name: 'Sobrancelha',
      description: 'Design e modelagem das sobrancelhas para realçar sua expressão e dar mais harmonia ao rosto.',
      duration: 15,
      price: 15.00,
      features: ['Design personalizado', 'Modelagem precisa', 'Técnica de pinça', 'Finalização com gel'],
      icon: Award,
      popular: false,
    },
    {
      id: 5,
      name: 'Corte Infantil',
      description: 'Corte especial para crianças com ambiente lúdico e profissionais especializados em atendimento infantil.',
      duration: 20,
      price: 20.00,
      features: ['Ambiente lúdico', 'Profissionais especializados', 'Corte sem trauma', 'Brinquedos disponíveis'],
      icon: Zap,
      popular: false,
    },
    {
      id: 6,
      name: 'Tratamento Capilar',
      description: 'Tratamentos especiais para cabelos danificados, hidratação profunda e revitalização.',
      duration: 60,
      price: 80.00,
      features: ['Diagnóstico capilar', 'Hidratação profunda', 'Produtos premium', 'Massagem relaxante'],
      icon: Shield,
      popular: false,
    },
  ]

  const benefits = [
    {
      title: 'Profissionais Qualificados',
      description: 'Barbeiros com anos de experiência e treinamento constante',
      icon: Star,
    },
    {
      title: 'Produtos Premium',
      description: 'Utilizamos apenas produtos de alta qualidade e marcas reconhecidas',
      icon: Award,
    },
    {
      title: 'Ambiente Higienizado',
      description: 'Seguimos rigorosos protocolos de higiene e sanitização',
      icon: Shield,
    },
    {
      title: 'Atendimento Rápido',
      description: 'Agendamento online e atendimento pontual para sua comodidade',
      icon: Clock,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="barber-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nossos Serviços
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Oferecemos uma gama completa de serviços para cuidar do seu visual 
              com qualidade e profissionalismo.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className={`relative hover:shadow-lg transition-shadow ${service.popular ? 'ring-2 ring-barber-accent' : ''}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-barber-accent text-barber-dark px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-barber-accent rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-barber-dark" />
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        <Clock className="inline h-4 w-4 mr-1" />
                        {service.duration} min
                      </span>
                      <span className="text-2xl font-bold text-barber-accent">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Inclui:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <Star className="h-3 w-3 mr-2 text-barber-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link href="/auth/register">
                      <Button className="w-full" variant={service.popular ? "barber" : "outline"}>
                        Agendar Serviço
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher nossos serviços?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Garantimos qualidade, segurança e satisfação em cada atendimento
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-barber-accent rounded-full flex items-center justify-center mb-4">
                    <benefit.icon className="h-8 w-8 text-barber-dark" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-barber-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para agendar?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Escolha seu serviço e agende seu horário de forma rápida e prática
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="barber" className="text-lg px-8 py-3">
                Fazer Reserva
              </Button>
            </Link>
            <Link href="/contato">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-barber-dark">
                Falar Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
