import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Help() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "Como posso registar-me na plataforma?",
      answer: "Pode registar-se de três formas: através do email e palavra-passe, usando a sua conta Google, ou através do registo simples com nome e palavra-passe. Clique em 'Entrar' no menu superior e escolha a opção que prefere."
    },
    {
      question: "É gratuito usar o Jikulumessu?",
      answer: "Sim, o registo e utilização básica da plataforma são totalmente gratuitos tanto para pessoas como para prestadores de serviços domésticos."
    },
    {
      question: "Como posso encontrar prestadores de serviços na minha área?",
      answer: "Use os filtros de localização para seleccionar a sua província, município e bairro. Também pode filtrar por tipo de serviço e tipo de contrato para encontrar exactamente o que procura."
    },
    {
      question: "Como contacto um prestador de serviços?",
      answer: "Clique no perfil do prestador de serviços que lhe interessa. Verá as informações de contacto incluindo telefone e redes sociais. Pode contactá-lo directamente através destes meios."
    },
    {
      question: "Posso editar o meu perfil após o registo?",
      answer: "Sim, pode editar todas as informações do seu perfil a qualquer momento. Vá à página 'Perfil' no menu superior e clique em 'Editar Perfil'."
    },
    {
      question: "Como posso apagar a minha conta?",
      answer: "Na página do seu perfil, encontrará uma opção para eliminar a conta. Esta acção é irreversível e removerá todas as suas informações da plataforma."
    },
    {
      question: "Que tipos de serviços posso encontrar?",
      answer: "A plataforma oferece diversos serviços: limpeza geral, cozinha, lavanderia, jardinagem, cuidados com idosos, e muitos outros. Pode filtrar por tipo de serviço para encontrar exactamente o que precisa."
    },
    {
      question: "Como funciona o sistema de localização?",
      answer: "Utilizamos um sistema hierárquico baseado na estrutura administrativa de Angola: Província → Município → Bairro. Pode inserir manualmente a sua localização ou permitir que a plataforma detecte automaticamente."
    },
    {
      question: "É seguro partilhar as minhas informações?",
      answer: "Sim, levamos a segurança muito a sério. Todas as informações são protegidas e apenas os contactos essenciais são partilhados entre utilizadores interessados em estabelecer uma relação de prestação de serviços."
    },
    {
      question: "Que tipos de contrato estão disponíveis?",
      answer: "Oferecemos três tipos principais: Contrato Mensal (trabalho regular com salário fixo), Diarista (trabalho por dias específicos), e Contrato Verbal (acordo informal e flexível)."
    },
    {
      question: "Como posso reportar um problema?",
      answer: "Se encontrar qualquer problema ou tiver questões adicionais, pode contactar-nos através do email suporte@jikulumessu.com ou através das nossas redes sociais."
    },
    {
      question: "Posso trabalhar como prestador de serviços em várias zonas?",
      answer: "Sim, no seu perfil pode indicar múltiplas zonas de trabalho e tipos de serviço que oferece. Isto aumenta as suas oportunidades de encontrar clientes."
    }
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ajuda</h1>
          <div className="w-24 h-1 bg-angola-red rounded-full"></div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-600">
              Encontre respostas às perguntas mais comuns sobre a utilização do Jikulumessu.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {openFAQ === index ? (
                    <Minus className="w-5 h-5 text-angola-red" />
                  ) : (
                    <Plus className="w-5 h-5 text-angola-red" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-angola-red rounded-lg p-6 text-white mt-8">
            <h2 className="text-2xl font-semibold mb-4">Ainda tem dúvidas?</h2>
            <p className="mb-4">
              Se não encontrou a resposta que procurava, não hesite em contactar-nos. 
              A nossa equipa está sempre disponível para ajudar.
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> <a href="mailto:d2413175@gmail.com" className="text-white hover:text-gray-200">suporte@jikulumessu.com</a></p>
              <p><strong>Horário:</strong> Segunda a Sexta, das 8h às 18h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}