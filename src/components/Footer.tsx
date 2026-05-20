import { Bike, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bike className="w-6 h-6 text-blue-600" />
              <span className="text-white text-lg font-semibold tracking-wide">MotaRoad</span>
            </div>
            <p className="text-gray-400 text-sm leading-6">
              Oficina especializada em manutenção, reparação e venda de motociclos, com serviço rigoroso e acompanhamento profissional.
            </p>
          </div>

          <div>
            <h3 className="text-white mb-4 font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Serviços</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Loja de Motas</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Peças</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Marcações</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4 font-semibold">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +351 912 345 678
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                geral@motaroad.pt
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Rua dos Motards, 123
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4 font-semibold">Redes Sociais</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © 2025 MotaRoad. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
