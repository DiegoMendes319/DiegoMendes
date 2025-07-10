import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Privacy() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
          <div className="w-24 h-1 bg-angola-red rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introdução</h2>
            <p className="text-gray-600 leading-relaxed">
              A Doméstica Angola valoriza a sua privacidade e compromete-se a proteger os seus dados pessoais. 
              Esta Política de Privacidade explica como recolhemos, utilizamos, armazenamos e protegemos as suas 
              informações quando utiliza a nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Informações que Recolhemos</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.1 Informações Fornecidas pelo Utilizador</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Nome completo e dados de contacto</li>
                  <li>• Endereço de email e número de telefone</li>
                  <li>• Data de nascimento e localização</li>
                  <li>• Informações profissionais e experiência</li>
                  <li>• Fotografias de perfil</li>
                  <li>• Informações de redes sociais (opcional)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.2 Informações Recolhidas Automaticamente</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Endereço IP e localização geográfica</li>
                  <li>• Tipo de dispositivo e navegador</li>
                  <li>• Páginas visitadas e tempo de permanência</li>
                  <li>• Preferências de utilização</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Como Utilizamos as Suas Informações</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Utilizamos as suas informações para:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Facilitar a ligação entre profissionais e clientes</li>
              <li>• Manter e melhorar a funcionalidade da plataforma</li>
              <li>• Verificar a identidade dos utilizadores</li>
              <li>• Fornecer apoio ao cliente</li>
              <li>• Enviar notificações importantes sobre o serviço</li>
              <li>• Prevenir fraudes e garantir a segurança</li>
              <li>• Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Partilha de Informações</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.1 Entre Utilizadores</h3>
                <p className="text-gray-600 leading-relaxed">
                  Partilhamos informações básicas de perfil (nome, contacto, serviços) entre utilizadores 
                  interessados em estabelecer uma relação profissional.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.2 Terceiros</h3>
                <p className="text-gray-600 leading-relaxed">
                  Não vendemos, alugamos ou partilhamos as suas informações pessoais com terceiros para 
                  fins comerciais, excepto quando necessário para o funcionamento da plataforma ou 
                  exigido por lei.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Segurança dos Dados</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger os seus dados:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Encriptação de dados em trânsito e em repouso</li>
              <li>• Acesso restrito às informações pessoais</li>
              <li>• Monitorização regular de segurança</li>
              <li>• Backups seguros e regulares</li>
              <li>• Formação da equipa em privacidade de dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Os Seus Direitos</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tem os seguintes direitos relativamente aos seus dados pessoais:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Acesso:</strong> Solicitar uma cópia dos seus dados</li>
              <li>• <strong>Correcção:</strong> Corrigir informações incorrectas</li>
              <li>• <strong>Eliminação:</strong> Solicitar a eliminação dos seus dados</li>
              <li>• <strong>Portabilidade:</strong> Receber os seus dados em formato estruturado</li>
              <li>• <strong>Oposição:</strong> Opor-se ao processamento dos seus dados</li>
              <li>• <strong>Limitação:</strong> Limitar o processamento dos seus dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Retenção de Dados</h2>
            <p className="text-gray-600 leading-relaxed">
              Mantemos os seus dados pessoais apenas pelo tempo necessário para cumprir os fins para os 
              quais foram recolhidos, incluindo requisitos legais, contabilísticos ou de relatório. 
              Quando eliminar a sua conta, os seus dados serão permanentemente removidos dentro de 30 dias.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Cookies e Tecnologias Similares</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Manter a sua sessão activa</li>
              <li>• Lembrar as suas preferências</li>
              <li>• Melhorar a experiência de utilização</li>
              <li>• Analisar o tráfego do site</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Pode gerir as suas preferências de cookies através das configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Transferências Internacionais</h2>
            <p className="text-gray-600 leading-relaxed">
              Os seus dados são processados principalmente em Angola. Se houver necessidade de transferir 
              dados para fora do país, garantimos que existem salvaguardas adequadas para proteger a 
              sua privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Menores de Idade</h2>
            <p className="text-gray-600 leading-relaxed">
              A nossa plataforma não é destinada a menores de 18 anos. Não recolhemos intencionalmente 
              informações de menores. Se tomamos conhecimento de que recolhemos dados de um menor, 
              tomaremos medidas para eliminar essas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Alterações à Política</h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos actualizar esta Política de Privacidade periodicamente. Notificaremos sobre 
              alterações significativas através da plataforma ou email. Recomendamos que reveja 
              regularmente esta página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contacto</h2>
            <p className="text-gray-600 leading-relaxed">
              Para questões sobre esta Política de Privacidade ou para exercer os seus direitos, 
              contacte-nos através do email: privacidade@domesticaangola.com
            </p>
          </section>

          <div className="bg-gray-100 rounded-lg p-4 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Última actualização:</strong> Janeiro de 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}