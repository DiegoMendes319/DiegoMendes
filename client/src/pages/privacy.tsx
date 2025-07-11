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
              O Jikulumessu é uma plataforma de intermediação que conecta pessoas com prestadores de serviços 
              domésticos. Esta Política de Privacidade explica como funciona a nossa plataforma e esclarece 
              que não coletamos ou armazenamos dados pessoais dos utilizadores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Política de Não Coleta de Dados</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.1 Dados de Utilizadores</h3>
                <p className="text-gray-600 leading-relaxed">
                  O Jikulumessu NÃO coleta, armazena ou processa dados pessoais dos utilizadores. 
                  Todas as informações fornecidas pelos utilizadores são armazenadas exclusivamente 
                  na base de dados da plataforma para fins de exibição de perfis públicos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.2 Dados Técnicos</h3>
                <p className="text-gray-600 leading-relaxed">
                  A plataforma pode utilizar dados técnicos básicos (como endereço IP) apenas para 
                  funcionamento técnico essencial da plataforma, mas não os armazena ou processa 
                  para fins comerciais ou de análise.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Função de Intermediação</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O Jikulumessu funciona exclusivamente como intermediário neutro:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Permite a exibição de perfis públicos de prestadores de serviços</li>
              <li>• Facilita a descoberta de serviços através de filtros de pesquisa</li>
              <li>• Não intermedeia contactos ou negociações</li>
              <li>• Não verifica ou valida informações dos utilizadores</li>
              <li>• Não é responsável por acordos ou transações entre utilizadores</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Responsabilidades dos Utilizadores</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.1 Informações Públicas</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ao criar um perfil na plataforma, os utilizadores concordam que as suas informações 
                  serão exibidas publicamente para fins de divulgação de serviços.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.2 Responsabilidade Própria</h3>
                <p className="text-gray-600 leading-relaxed">
                  Os utilizadores são responsáveis por verificar e validar as informações de outros 
                  utilizadores antes de estabelecer qualquer contacto ou acordo.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitações de Responsabilidade</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O Jikulumessu não se responsabiliza por:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Veracidade das informações fornecidas pelos utilizadores</li>
              <li>• Qualidade dos serviços prestados</li>
              <li>• Acordos ou transações entre utilizadores</li>
              <li>• Danos resultantes de contactos através da plataforma</li>
              <li>• Segurança de dados partilhados directamente entre utilizadores</li>
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
              contacte-nos através do email: <a href="mailto:d2413175@gmail.com" className="text-blue-600 hover:text-blue-800">contacto@jikulumessu.ao</a>
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