import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { motion } from "motion/react";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-white mb-4">Contacto</h1>
            <p className="text-gray-300 max-w-2xl">
              Estamos disponíveis para o atender. Entre em contacto connosco.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Telemóvel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">+351 912 345 678</p>
                  <p className="text-gray-600">+351 213 456 789</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>E-mail</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">geral@motooficina.pt</p>
                  <p className="text-gray-600">info@motooficina.pt</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Morada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Rua dos Motards, 123</p>
                  <p className="text-gray-600">1000-001 Lisboa</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <CardTitle>Horário de Funcionamento</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-700">Segunda a Sexta</span>
                  <span className="text-gray-900">09:00 - 19:00</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-700">Sábado</span>
                  <span className="text-gray-900">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-700">Domingo</span>
                  <span className="text-gray-900">Encerrado</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-700">Feriados</span>
                  <span className="text-gray-900">Encerrado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
