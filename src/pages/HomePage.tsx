import { Button } from "../components/ui/button";
import { ServiceCard } from "../components/ServiceCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { 
  Calendar, 
  Phone, 
  CheckCircle2,
  Settings,
  Wrench,
  Gauge,
  Cog,
  Shield,
  Zap,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
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

  const whyChooseUs = [
    "Mais de 15 anos de experiência",
    "Equipa técnica especializada",
    "Equipamento moderno e certificado",
    "Peças originais e de qualidade",
    "Preços justos e transparentes",
    "Garantia de todos os serviços"
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1636761358757-0a616eb9e17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwd29ya3Nob3AlMjBtZWNoYW5pY3xlbnwxfHx8fDE3NjAxMTI5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Oficina de Motas"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-gray-50 mb-6">
              A Sua Oficina de Confiança para Todas as Motas
            </h1>
            <p className="text-gray-200 mb-8">
              Oferecemos serviços de mecânica especializada em motociclos com qualidade, 
              transparência e profissionalismo. Agende a sua revisão e mantenha a sua mota 
              sempre em perfeito estado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => onNavigate("booking")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Revisão
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 text-white border-white hover:bg-white/20"
              >
                <Phone className="w-5 h-5 mr-2" />
                +351 912 345 678
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-gray-900 mb-4">
              Os Nossos Serviços
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma ampla gama de serviços para motas com equipamento moderno 
              e profissionais altamente qualificados
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={() => onNavigate("services")}>
              Ver Todos os Serviços
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-gray-900 mb-6">
                Por Que Escolher a Nossa Oficina?
              </h2>
              <p className="text-gray-600 mb-8">
                Somos uma oficina especializada em manutenção de motociclos, comprometida em 
                oferecer serviços de alta qualidade com preços justos e atendimento personalizado. 
                A paixão pelas motas move-nos todos os dias.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {whyChooseUs.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Button onClick={() => onNavigate("booking")} size="lg">
                Agendar Horário
              </Button>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1623221013483-1f3cbeffdcec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmVwYWlyJTIwc2VydmljZXxlbnwxfHx8fDE3NjAxMTI5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Reparação de Motas"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1651152849966-c4d04f089981?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbWFpbnRlbmFuY2V8ZW58MXx8fHwxNzYwMTEyOTg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Manutenção de Motas"
                className="rounded-lg shadow-lg w-full h-64 object-cover mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white mb-4">
              Pronto para Cuidar da Sua Mota?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Agende agora a sua revisão e garanta a segurança e performance da sua mota
            </p>
            <Button 
              size="lg" 
              onClick={() => onNavigate("booking")}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Agendar a Minha Revisão
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
