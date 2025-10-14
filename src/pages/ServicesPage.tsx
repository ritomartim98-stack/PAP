import { ServiceCard } from "../components/ServiceCard";
import { Button } from "../components/ui/button";
import { Calendar, Settings, Wrench, Gauge, Cog, Shield, Zap, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const services = [
    {
      icon: Settings,
      title: "Revisão Completa",
      description: "Manutenção preventiva completa da sua mota",
      features: [
        "Verificação de todos os sistemas",
        "Mudança de óleo e filtros",
        "Checklist completo de segurança",
        "Relatório detalhado"
      ]
    },
    {
      icon: Wrench,
      title: "Manutenção Preventiva",
      description: "Evite problemas futuros com manutenção regular",
      features: [
        "Inspeção de travões",
        "Verificação de suspensão",
        "Análise de fluidos",
        "Teste de bateria"
      ]
    },
    {
      icon: Gauge,
      title: "Diagnóstico Eletrónico",
      description: "Identificação precisa de problemas eletrónicos",
      features: [
        "Scanner avançado para motas",
        "Diagnóstico de avarias",
        "Limpeza de códigos de erro",
        "Teste de sensores"
      ]
    },
    {
      icon: Cog,
      title: "Corrente e Transmissão",
      description: "Manutenção essencial para performance",
      features: [
        "Limpeza e lubrificação",
        "Tensionamento da corrente",
        "Substituição de kit completo",
        "Verificação de coroa e pinhão"
      ]
    },
    {
      icon: Shield,
      title: "Sistema de Travões",
      description: "A sua segurança em primeiro lugar",
      features: [
        "Substituição de pastilhas e discos",
        "Purga do sistema hidráulico",
        "Verificação de pinças",
        "Teste de eficiência"
      ]
    },
    {
      icon: Zap,
      title: "Pneus e Rodas",
      description: "Aderência e segurança garantidas",
      features: [
        "Substituição de pneus",
        "Equilibragem de rodas",
        "Verificação de pressões",
        "Inspeção de desgaste"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-white mb-4">Os Nossos Serviços</h1>
            <p className="text-orange-100 max-w-2xl">
              Oferecemos uma gama completa de serviços especializados para motas. 
              Equipamento moderno e técnicos certificados ao seu serviço.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={() => onNavigate("booking")}>
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Serviço Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 text-center mb-12">Entre em Contacto</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-lg text-center"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Telemóvel</h3>
              <p className="text-gray-600">+351 912 345 678</p>
              <p className="text-gray-600">+351 213 456 789</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 p-6 rounded-lg text-center"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-gray-900 mb-2">E-mail</h3>
              <p className="text-gray-600">geral@motooficina.pt</p>
              <p className="text-gray-600">info@motooficina.pt</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 p-6 rounded-lg text-center"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Morada</h3>
              <p className="text-gray-600">Rua dos Motards, 123</p>
              <p className="text-gray-600">1000-001 Lisboa</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
