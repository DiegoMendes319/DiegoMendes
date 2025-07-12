import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sobre Jikulumessu</h1>
          <div className="w-24 h-1 bg-angola-red rounded-full"></div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">A Nossa Missão</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              O Jikulumessu foi criado como uma plataforma de intermediação para conectar pessoas que precisam 
              de serviços com prestadores de serviços na região. A nossa missão é facilitar estas 
              conexões, servindo como intermediário neutro que permite a divulgação e descoberta de serviços 
              diversos, desde limpeza até transporte, educação, eventos e muitos outros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">A Nossa Visão</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Ser a plataforma de referência em Angola para divulgação de serviços, 
              funcionando como um intermediário neutro e transparente. Queremos criar um espaço 
              onde prestadores de serviços possam divulgar o seu trabalho e pessoas interessadas 
              possam encontrar ajuda para as suas necessidades diversas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">A Nossa Equipa</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Tecnologia e Inovação</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A nossa equipa técnica trabalha continuamente para melhorar a plataforma, 
                  garantindo uma experiência intuitiva para todos os utilizadores como intermediário neutro.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Apoio ao Cliente</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Temos uma equipa dedicada ao apoio ao cliente, pronta para ajudar com qualquer 
                  questão ou dúvida que possa surgir durante a utilização da plataforma.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Os Nossos Valores</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-angola-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">C</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Confiança</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Promovemos transparência na intermediação, sem assumir responsabilidades diretas.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-angola-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-800 font-bold">Q</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Qualidade</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Garantimos padrões elevados de qualidade em todos os serviços oferecidos.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-angola-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">R</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Respeito</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Valorizamos e respeitamos todos os profissionais e pessoas da nossa comunidade.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}