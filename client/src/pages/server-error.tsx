import { AlertTriangle, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import JikulumessuIcon from "@/components/jikulumessu-icon";

export default function ServerErrorPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 border border-red-200 dark:border-red-700">
          {/* Icon and Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <JikulumessuIcon size="xl" className="text-red-600 dark:text-red-400" />
              <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Servidor Indisponível
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            O servidor do Jikulumessu está temporariamente indisponível devido a uma falha técnica.
          </p>
          
          {/* Critical Warning */}
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                  Aviso Importante
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                  Devido à falha do servidor, <strong>todos os dados dos utilizadores podem ter sido perdidos</strong>, incluindo:
                </p>
                <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
                  <li>Perfis de utilizador</li>
                  <li>Fotografias de perfil</li>
                  <li>Avaliações e comentários</li>
                  <li>Histórico de contactos</li>
                </ul>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Será necessário criar novos perfis quando o serviço for restaurado.
                </p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-4">
            <Button 
              onClick={handleRefresh}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Para relatórios de problemas:
              </p>
              <a 
                href="mailto:contacto@jikulumessu.ao"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium inline-flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                contacto@jikulumessu.ao
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}