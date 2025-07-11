import { ArrowLeft, Shield, Lock, Eye, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Security() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Segurança</h1>
          <div className="w-24 h-1 bg-angola-red rounded-full"></div>
        </div>

        <div className="space-y-8">
          <section>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-angola-red mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">O Nosso Compromisso com a Segurança</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                A segurança dos nossos utilizadores é a nossa prioridade máxima. Implementamos múltiplas 
                camadas de protecção para garantir que os seus dados pessoais e profissionais estão seguros 
                e que as interacções na plataforma são confiáveis.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Medidas de Segurança Implementadas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Lock className="w-6 h-6 text-angola-red mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Encriptação de Dados</h3>
                </div>
                <p className="text-gray-600">
                  Todos os dados são encriptados em trânsito e em repouso usando protocolos de segurança 
                  padrão da indústria (SSL/TLS 256-bit). As suas informações pessoais são protegidas 
                  contra acesso não autorizado.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-angola-red mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Monitorização 24/7</h3>
                </div>
                <p className="text-gray-600">
                  A nossa plataforma é monitorizada continuamente para detectar actividades suspeitas, 
                  tentativas de acesso não autorizado e possíveis ameaças à segurança.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-angola-red mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Verificação de Utilizadores</h3>
                </div>
                <p className="text-gray-600">
                  Implementamos processos de verificação para garantir a autenticidade dos perfis. 
                  Todos os novos registos passam por validação básica antes de serem activados.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-angola-red mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Sistema de Alertas</h3>
                </div>
                <p className="text-gray-600">
                  Temos um sistema de alertas que notifica sobre actividades suspeitas e permite 
                  reportar comportamentos inadequados ou potencialmente perigosos.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Boas Práticas de Segurança</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Para Profissionais Domésticos</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Mantenha as suas informações de perfil actualizadas e verdadeiras</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Nunca partilhe informações pessoais sensíveis antes de estabelecer confiança</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Encontre clientes em locais públicos na primeira reunião</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Informe familiares sobre novos trabalhos e localizações</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Reporte comportamentos suspeitos ou inadequados</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Para Pessoas/Clientes</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Verifique referências e experiência antes de contratar</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Estabeleça acordos claros sobre horários e responsabilidades</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Mantenha objectos de valor em locais seguros</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Trate os profissionais com respeito e dignidade</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Reporte qualquer comportamento inadequado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Segurança da Conta</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Palavras-passe Seguras</h3>
                  <p className="text-gray-600">
                    Use palavras-passe fortes com pelo menos 8 caracteres, incluindo letras maiúsculas, 
                    minúsculas, números e símbolos. Nunca partilhe a sua palavra-passe com terceiros.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Autenticação Multi-Factor</h3>
                  <p className="text-gray-600">
                    Oferecemos opções de login através do Google para adicionar uma camada extra de 
                    segurança à sua conta.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Logout Seguro</h3>
                  <p className="text-gray-600">
                    Sempre termine a sua sessão quando usar dispositivos públicos ou partilhados. 
                    Mantenha a sua conta segura fazendo logout adequadamente.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reportar Problemas de Segurança</h2>
            <div className="bg-angola-red rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Contacte-nos Imediatamente</h3>
              <p className="mb-4">
                Se detectar qualquer actividade suspeita, violação de segurança ou comportamento 
                inadequado, contacte-nos imediatamente através dos canais abaixo:
              </p>
              <div className="space-y-2">
                <p><strong>Email de Segurança:</strong> <a href="mailto:d2413175@gmail.com" className="text-white hover:text-gray-200">suporte@jikulumessu.com</a></p>
                <p><strong>Disponível:</strong> 24 horas por dia, 7 dias por semana</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Actualizações de Segurança</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 leading-relaxed">
                Actualizamos regularmente as nossas medidas de segurança para enfrentar novas ameaças 
                e vulnerabilidades. Implementamos patches de segurança assim que estão disponíveis e 
                realizamos auditorias regulares dos nossos sistemas.
              </p>
            </div>
          </section>

          <section>
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Lembre-se</h3>
              <p className="text-gray-600">
                A segurança é uma responsabilidade partilhada. Enquanto fazemos tudo o que podemos 
                para proteger a plataforma, também dependemos dos nossos utilizadores para seguir 
                as melhores práticas de segurança e reportar qualquer problema que encontrem.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}