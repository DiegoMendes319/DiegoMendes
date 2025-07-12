import { ArrowLeft, Shield, Lock, Eye, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Security() {
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Segurança</h1>
          <div className="w-24 h-1 bg-angola-red rounded-full"></div>
        </div>

        <div className="space-y-8">
          <section>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-angola-red mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">O Nosso Compromisso com a Segurança</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                A segurança dos nossos utilizadores é a nossa prioridade máxima. Implementamos múltiplas 
                camadas de protecção para garantir que os seus dados pessoais e profissionais estão seguros 
                e que as interacções na plataforma são confiáveis.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Medidas de Segurança Implementadas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Lock className="w-6 h-6 text-angola-red mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Encriptação de Dados</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Todos os dados são encriptados em trânsito e em repouso usando protocolos de segurança 
                  padrão da indústria (SSL/TLS 256-bit). As suas informações pessoais são protegidas 
                  contra acesso não autorizado.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-angola-red mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Monitorização 24/7</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  A nossa plataforma é monitorizada continuamente para detectar actividades suspeitas, 
                  tentativas de acesso não autorizado e possíveis ameaças à segurança.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-angola-red mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Verificação de Utilizadores</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Implementamos processos de verificação para garantir a autenticidade dos perfis. 
                  Todos os novos registos passam por validação básica antes de serem activados.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-angola-red mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sistema de Alertas</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Detectamos e alertamos sobre comportamentos suspeitos ou tentativas de fraude, 
                  mantendo a comunidade segura e protegida.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Dicas de Segurança para Utilizadores</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Verifique sempre os perfis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Analise cuidadosamente as informações do perfil, experiência e avaliações antes de fazer contacto.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Comunique de forma segura</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Mantenha as conversas profissionais e evite partilhar informações pessoais desnecessárias.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Defina acordos claros</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Estabeleça termos claros sobre o trabalho, prazos e pagamentos antes de iniciar qualquer serviço.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Reporte actividades suspeitas</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Contacte-nos imediatamente se detectar comportamentos suspeitos ou tentativas de fraude.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-red-800 dark:text-red-200 mb-4">
                Importante: Limitações de Responsabilidade
              </h2>
              <p className="text-red-700 dark:text-red-300 leading-relaxed mb-4">
                O Jikulumessu actua exclusivamente como intermediário neutro. Não nos responsabilizamos por:
              </p>
              <ul className="space-y-2 text-red-700 dark:text-red-300">
                <li>• Qualidade dos serviços prestados</li>
                <li>• Acordos ou transações entre utilizadores</li>
                <li>• Danos ou prejuízos resultantes de contactos através da plataforma</li>
                <li>• Veracidade das informações fornecidas pelos utilizadores</li>
                <li>• Segurança de dados partilhados directamente entre utilizadores</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Contacto de Segurança</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Se detectar algum problema de segurança, comportamento suspeito ou tiver questões sobre 
                a protecção dos seus dados, contacte-nos imediatamente através do email: 
                <a href="mailto:d2413175@gmail.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                  contacto@jikulumessu.ao
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}