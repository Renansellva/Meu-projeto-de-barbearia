import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Users, Clock, Star } from 'lucide-react'

export default function SobrePage() {
  const stats = [
    { number: '10+', label: 'Anos de Experiência', icon: Award },
    { number: '5000+', label: 'Clientes Satisfeitos', icon: Users },
    { number: '15+', label: 'Minutos de Atendimento', icon: Clock },
    { number: '4.9', label: 'Avaliação Média', icon: Star },
  ]

  const team = [
    {
      name: 'João Silva',
      role: 'Barbeiro Sênior',
      experience: '8 anos',
      specialties: ['Corte Clássico', 'Barba', 'Bigode'],
      image: '/images/barber1.jpg',
    },
    {
      name: 'Pedro Santos',
      role: 'Barbeiro Especialista',
      experience: '6 anos',
      specialties: ['Corte Moderno', 'Barba Desenhada', 'Sobrancelha'],
      image: '/images/barber2.jpg',
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
              Sobre a Barbearia Elite
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Há mais de 10 anos oferecendo os melhores cuidados masculinos 
              com tradição, qualidade e inovação.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-barber-accent rounded-full flex items-center justify-center mb-4">
                    <stat.icon className="h-8 w-8 text-barber-dark" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-barber-accent">
                    {stat.number}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  A Barbearia Elite nasceu em 2013 com o sonho de oferecer aos homens 
                  um espaço onde pudessem cuidar do seu visual com qualidade, conforto 
                  e tradição. Desde então, temos crescido e evoluído, sempre mantendo 
                  nossos valores fundamentais.
                </p>
                <p>
                  Nossa missão é proporcionar uma experiência única de cuidados masculinos, 
                  combinando técnicas tradicionais com tendências modernas. Cada cliente 
                  é tratado com atenção especial e recebe um serviço personalizado.
                </p>
                <p>
                  Hoje, somos referência na região, atendendo mais de 5000 clientes 
                  satisfeitos e contando com uma equipe de profissionais altamente 
                  qualificados e apaixonados pelo que fazem.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Imagem da Barbearia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Profissionais experientes e apaixonados pelo que fazem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="bg-gray-200 h-64 flex items-center justify-center">
                  <p className="text-gray-500">Foto do {member.name}</p>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-barber-accent font-medium">{member.role}</p>
                  <p className="text-sm text-gray-600">Experiência: {member.experience}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium mb-2">Especialidades:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-barber-accent text-barber-dark text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Os princípios que guiam nosso trabalho diário
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-barber-accent rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-barber-dark" />
                </div>
                <CardTitle>Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oferecemos sempre o melhor serviço, utilizando produtos 
                  de qualidade e técnicas atualizadas.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-barber-accent rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-barber-dark" />
                </div>
                <CardTitle>Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cada cliente é único e recebe atenção personalizada 
                  e um atendimento de excelência.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-barber-accent rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-barber-dark" />
                </div>
                <CardTitle>Tradição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Mantemos as tradições da barbearia clássica, 
                  combinadas com as tendências modernas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
