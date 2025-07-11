import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Termos de Serviço</h1>
          <div className="w-24 h-1 bg-angola-red rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-600 leading-relaxed">
              Ao aceder e utilizar a plataforma Jikulumessu, o utilizador concorda em cumprir e ficar vinculado 
              aos presentes Termos de Serviço. O Jikulumessu funciona exclusivamente como intermediário neutro 
              entre pessoas que procuram serviços e prestadores de serviços. Se não concordar com 
              algum dos termos aqui estabelecidos, não deve utilizar a nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O Jikulumessu é uma plataforma digital de intermediação que permite a prestadores de serviços 
              divulgar os seus serviços e a pessoas interessadas encontrar esses serviços. 
              Funcionamos exclusivamente como intermediário neutro, não sendo responsáveis pela qualidade 
              dos serviços prestados, acordos estabelecidos ou quaisquer transações entre utilizadores.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Os serviços divulgados incluem, mas não se limitam a: limpeza, cozinha, lavanderia, 
              jardinagem, transporte, eventos, manutenção, beleza, educação, segurança e outros serviços rápidos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Registo e Conta de Utilizador</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">3.1 Requisitos de Registo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Para utilizar a plataforma, deve criar uma conta fornecendo informações verdadeiras, 
                  actualizadas e completas. É responsável por manter a confidencialidade das suas credenciais.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">3.2 Idade Mínima</h3>
                <p className="text-gray-600 leading-relaxed">
                  Deve ter pelo menos 18 anos para criar uma conta e utilizar os nossos serviços.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">3.3 Responsabilidade da Conta</h3>
                <p className="text-gray-600 leading-relaxed">
                  É responsável por todas as actividades que ocorrem na sua conta e deve notificar-nos 
                  imediatamente sobre qualquer uso não autorizado.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Responsabilidades dos Utilizadores</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.1 Prestadores de Serviços</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Fornecer informações verdadeiras sobre experiência e serviços</li>
                  <li>• Manter actualizado o perfil e disponibilidade</li>
                  <li>• Ser responsável por todos os acordos estabelecidos directamente</li>
                  <li>• Respeitar a privacidade e propriedade dos clientes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.2 Pessoas/Clientes</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Tratar os prestadores de serviços com respeito e dignidade</li>
                  <li>• Verificar informações antes de estabelecer contacto</li>
                  <li>• Ser responsável por todos os acordos estabelecidos directamente</li>
                  <li>• Respeitar os horários e disponibilidade dos prestadores de serviços</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Proibições e Restrições</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              É expressamente proibido utilizar a plataforma para:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Actividades ilegais ou fraudulentas</li>
              <li>• Discriminação baseada em raça, género, religião ou origem</li>
              <li>• Assédio ou comportamento inadequado</li>
              <li>• Partilha de informações falsas ou enganosas</li>
              <li>• Violação de direitos de propriedade intelectual</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitação de Responsabilidade</h2>
            <p className="text-gray-600 leading-relaxed">
              O Jikulumessu actua exclusivamente como intermediário neutro para divulgação de serviços. 
              NÃO somos responsáveis por disputas, danos, problemas, acordos ou transações que possam surgir 
              entre utilizadores. Cada utilizador é inteiramente responsável por verificar informações, 
              estabelecer acordos e negociar condições directamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Propriedade Intelectual</h2>
            <p className="text-gray-600 leading-relaxed">
              Todo o conteúdo da plataforma, incluindo design, logótipos, textos e funcionalidades, é propriedade 
              do Jikulumessu e está protegido por leis de direitos autorais. O uso não autorizado é proibido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Modificações dos Termos</h2>
            <p className="text-gray-600 leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações serão 
              comunicadas através da plataforma e entrarão em vigor 30 dias após a publicação.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Rescisão</h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos suspender ou encerrar a sua conta a qualquer momento por violação destes termos. 
              Pode também encerrar a sua conta a qualquer momento através das configurações do perfil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Lei Aplicável</h2>
            <p className="text-gray-600 leading-relaxed">
              Estes termos são regidos pelas leis da República de Angola. Qualquer disputa será resolvida 
              nos tribunais competentes de Angola.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contacto</h2>
            <p className="text-gray-600 leading-relaxed">
              Para questões sobre estes Termos de Serviço, contacte-nos através do email: 
              <a href="mailto:d2413175@gmail.com" className="text-blue-600 hover:text-blue-800">contacto@jikulumessu.ao</a>
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