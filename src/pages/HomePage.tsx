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
  ArrowRight,
  Clock,
  Award,
  Users,
  Star,
  MapPin,
  Mail
} from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

// Statistics data
const stats = [
  { icon: Award, value: "15+", label: "Anos de Experiência" },
  { icon: Users, value: "5000+", label: "Clientes Satisfeitos" },
  { icon: Settings, value: "10000+", label: "Reparações Realizadas" },
  { icon: Star, value: "4.9/5", label: "Avaliação Média" }
];

// Testimonials data
const testimonials = [
  {
    name: "Ricardo Martins",
    motorcycle: "Yamaha MT-07",
    rating: 5,
    text: "Excelente serviço! Equipa profissional e atenciosa. Sempre que preciso de manutenção para a minha mota, sei onde confiar."
  },
  {
    name: "Sofia Ferreira",
    motorcycle: "Honda CB650R",
    rating: 5,
    text: "Atendimento impecável e preços justos. Recomendo a todos os motociclistas que procuram qualidade."
  },
  {
    name: "Miguel Santos",
    motorcycle: "Kawasaki Z900",
    rating: 5,
    text: "Profissionais genuínos que sabem o que fazem. Diagnóstico preciso e resolução eficiente de todos os problemas."
  }
];

// Team members
const team = [
  {
    name: "João Silva",
    role: "Mecânico Chefe",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    description: "Especialista em sistemas eletrónicos e injeção"
  },
  {
    name: "Paulo Ribeiro",
    role: "Técnico de Manutenção",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    description: "Especialista em sistemas de travagem e suspensão"
  }
];

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
      {/* Hero Section - First impression */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback
            src="https://www.yamaha-motor.eu/content/dam/yme/language-masters/en/segment-header-images/2024_YAM_YZ50th_Family_EU_PWS1_STA_001.tif"
            alt="Oficina de Motas"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-200 text-sm font-medium">Oficina Especializada em Motociclos</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Excelência em <span className="text-blue-400">Manutenção</span> de Motociclos
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
              Serviço profissional de excelência para a sua mota. Equipa especializada, 
              equipamento moderno e compromisso com a sua segurança.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => onNavigate("booking")}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Revisão
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/5 text-white border-white/20 hover:bg-white/15"
              >
                <Phone className="w-5 h-5 mr-2" />
                +351 912 345 678
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Os Nossos Serviços</span>
            <h2 className="text-3xl md:text-4xl text-gray-900 mt-3 mb-4 font-bold">
              Tudo o que a Sua Mota Precisa
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Oferecemos serviços completos de manutenção e reparação com equipamento 
              moderno e profissionais altamente qualificados
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
            <Button size="lg" onClick={() => onNavigate("services")} className="bg-blue-600 hover:bg-blue-700">
              Ver Todos os Serviços
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Sobre Nós</span>
              <h2 className="text-3xl md:text-4xl text-gray-900 mt-3 mb-6 font-bold">
                Por Que Escolher a Nossa Oficina?
              </h2>
              <p className="text-gray-500 mb-8 text-lg leading-relaxed">
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
                    <span className="text-gray-600">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Button onClick={() => onNavigate("booking")} size="lg" className="bg-blue-600 hover:bg-blue-700">
                Agendar Horário
              </Button>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1623221013483-1f3cbeffdcec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmVwYWlyJTIwc2VydmljZXxlbnwxfHx8fDE3NjAxMTI5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Reparação de Motas"
                className="rounded-xl shadow-lg w-full h-48 md:h-64 object-cover"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1651152849966-c4d04f089981?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbWFpbnRlbmFuY2V8ZW58MXx8fHwxNzYwMTEyOTg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Manutenção de Motas"
                className="rounded-xl shadow-lg w-full h-48 md:h-64 object-cover mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Social proof */}
      <section className="py-12 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center py-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-full mb-3">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Nossa Equipa</span>
            <h2 className="text-3xl md:text-4xl text-gray-900 mt-3 mb-4 font-bold">
              Profissionais Dedicados
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Uma equipa apaixonada por motociclos, pronta para oferecer o melhor serviço
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Testemunhos</span>
            <h2 className="text-3xl md:text-4xl text-gray-900 mt-3 mb-4 font-bold">
              O Que Os Nossos Clientes Dizem
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-500 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.motorcycle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para Cuidar da Sua Mota?
            </h2>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto text-lg">
              Agende agora a sua revisão e garanta a segurança e performance da sua mota
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => onNavigate("booking")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar a Minha Revisão
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate("contact")}
                className="bg-white/5 text-white border-white/20 hover:bg-white/10"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contactar-nos
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <motion.div
              className="flex flex-col items-center py-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-white font-semibold mb-1">Telefone</p>
              <p className="text-gray-400 text-sm">+351 912 345 678</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center py-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-white font-semibold mb-1">Horário</p>
              <p className="text-gray-400 text-sm">Seg-Sex: 9h-18h | Sáb: 9h-13h</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center py-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-white font-semibold mb-1">Localização</p>
              <p className="text-gray-400 text-sm">Rua da Oficina, 123, Lisboa</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
