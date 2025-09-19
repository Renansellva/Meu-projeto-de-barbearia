import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-barber-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold barber-text-gradient mb-4">
              Barbearia Elite
            </h3>
            <p className="text-gray-300 mb-4">
              Sua barbearia de confiança há mais de 10 anos. Oferecemos os melhores 
              serviços de corte, barba e cuidados masculinos com profissionais 
              qualificados e ambiente moderno.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-barber-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-barber-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-barber-accent transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-barber-accent transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="text-gray-300 hover:text-barber-accent transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-barber-accent transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-2 text-barber-accent" />
                <span className="text-sm">
                  Rua das Flores, 123<br />
                  Centro, São Paulo - SP
                </span>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-2 text-barber-accent" />
                <span className="text-sm">(11) 99999-9999</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-2 text-barber-accent" />
                <span className="text-sm">contato@barbeariaelite.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Horário de Funcionamento */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Horário de Funcionamento</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
              <div>
                <span className="font-medium">Segunda - Sexta:</span><br />
                08:00 - 18:00
              </div>
              <div>
                <span className="font-medium">Sábado:</span><br />
                08:00 - 16:00
              </div>
              <div>
                <span className="font-medium">Domingo:</span><br />
                Fechado
              </div>
              <div>
                <span className="font-medium">Feriados:</span><br />
                Consulte
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Barbearia Elite. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
