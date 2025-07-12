import { Wrench, Clock, Heart } from "lucide-react";
import JikulumessuIcon from "../components/jikulumessu-icon";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <JikulumessuIcon size="xl" className="text-red-600" />
          </div>
          
          {/* Maintenance Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
              <Wrench className="w-12 h-12 text-red-600 animate-pulse" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Site em Manutenção
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Estamos a trabalhar para melhorar a sua experiência no Jikulumessu. 
            O site voltará em breve com novas funcionalidades e melhorias.
          </p>
          
          {/* Status */}
          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Voltaremos em breve</span>
          </div>
          
          {/* Contact Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Precisa de ajuda urgente?
            </p>
            <a 
              href="mailto:contacto@jikulumessu.ao"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
            >
              contacto@jikulumessu.ao
            </a>
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              Feito com <Heart className="w-3 h-3 text-red-500" /> pela equipa <span className="cursor-pointer select-none" onClick={() => window.location.href = '/admin-login'}>Jikulumessu</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}