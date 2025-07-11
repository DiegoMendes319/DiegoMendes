import { ArrowLeft, UserPlus, Search, Phone, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Como Funciona</h1>
          <div className="w-24 h-1 bg-angola-red rounded-full"></div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Para Pessoas que Procuram Ajuda
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">1. Pesquisar</h3>
                <p className="text-sm text-gray-600">
                  Use os filtros para encontrar prestadores de serviços na sua área por localização, serviços e tipo de contrato.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-gray-800" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">2. Escolher</h3>
                <p className="text-sm text-gray-600">
                  Veja os perfis detalhados, experiência e disponibilidade dos prestadores de serviços.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">3. Contactar</h3>
                <p className="text-sm text-gray-600">
                  Entre em contacto directamente através do telefone ou redes sociais.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">4. Negociar</h3>
                <p className="text-sm text-gray-600">
                  Negocie directamente os termos e condições do serviço pretendido.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Para Prestadores de Serviços
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">1. Registar-se</h3>
                <p className="text-sm text-gray-600">
                  Crie o seu perfil com informações pessoais, experiência e serviços que oferece.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-800" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">2. Completar</h3>
                <p className="text-sm text-gray-600">
                  Preencha todos os detalhes do seu perfil para aumentar as suas oportunidades.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">3. Receber</h3>
                <p className="text-sm text-gray-600">
                  Pessoas interessadas irão contactá-lo directamente através das suas informações.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">4. Negociar</h3>
                <p className="text-sm text-gray-600">
                  Negocie directamente os termos e condições dos seus serviços.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tipos de Serviços Disponíveis</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Serviços Gerais</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Limpeza geral</li>
                  <li>• Cozinhar</li>
                  <li>• Passadoria</li>
                  <li>• Jardinagem</li>
                  <li>• Lavanderia</li>
                  <li>• Organização</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Cuidados Pessoais</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Cuidado de crianças</li>
                  <li>• Cuidado de idosos</li>
                  <li>• Babá</li>
                  <li>• Fazer compras</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Transporte</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Taxista de automóvel</li>
                  <li>• Taxista de mota</li>
                  <li>• Cobrador de táxi</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Eventos e Entretenimento</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Decoração de eventos</li>
                  <li>• Animador de festas</li>
                  <li>• Fotógrafo</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Manutenção e Reparos</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Pintura</li>
                  <li>• Carpintaria</li>
                  <li>• Electricista</li>
                  <li>• Canalização</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Beleza e Educação</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Cabeleireiro</li>
                  <li>• Manicure</li>
                  <li>• Massagista</li>
                  <li>• Professor particular</li>
                  <li>• Costura</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-angola-red rounded-lg p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">Tipos de Contrato</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Tempo Inteiro</h3>
                <p className="text-sm opacity-90">
                  Trabalho regular com horário fixo e salário mensal definido.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Por Horas</h3>
                <p className="text-sm opacity-90">
                  Trabalho por horas específicas, com pagamento por hora ou por serviço.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Freelance</h3>
                <p className="text-sm opacity-90">
                  Trabalho projectual ou eventual, com flexibilidade nos termos.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}