import { ArrowLeft, UserPlus, Search, Phone, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Como Funciona</h1>
          <div className="w-24 h-1 bg-angola-red rounded-full"></div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Para Pessoas que Procuram Ajuda
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">1. Pesquisar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Use os filtros para encontrar prestadores de serviços na sua área por localização, serviços e tipo de contrato.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-gray-800" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">2. Escolher</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Veja os perfis detalhados, experiência e disponibilidade dos prestadores de serviços.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">3. Contactar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Entre em contacto directamente através do telefone ou email.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">4. Negociar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Negocie directamente os termos e condições do serviço pretendido.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Para Prestadores de Serviços
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">1. Registar-se</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Crie um perfil completo com as suas informações, serviços oferecidos e disponibilidade.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-gray-800" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">2. Publicar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Detalhe os seus serviços, experiência e preços para atrair clientes interessados.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-angola-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">3. Receber Contactos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receba contactos directos de pessoas interessadas nos seus serviços.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">4. Prestar Serviços</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Preste os seus serviços com qualidade e receba avaliações positivas.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
              Papel do Jikulumessu
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-center">
              O Jikulumessu atua exclusivamente como intermediário neutro. Não nos responsabilizamos por acordos, 
              transações ou qualidade dos serviços prestados. A nossa função é apenas facilitar a descoberta e 
              contacto entre prestadores de serviços e pessoas interessadas.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">F</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Facilitamos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Conexões entre prestadores de serviços e pessoas interessadas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">M</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Mostramos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Perfis públicos com informações de contacto dos prestadores.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">N</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Não Mediamos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Acordos, pagamentos ou questões entre utilizadores.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}