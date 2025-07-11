import { Link } from "wouter";
import { Home, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import JikulumessuIcon from "./jikulumessu-icon";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <JikulumessuIcon size="md" className="text-[var(--angola-red)]" />
              <span className="text-xl font-bold">Jikulumessu</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Intermediário neutro que conecta pessoas com prestadores de serviços domésticos.
              Facilitamos a descoberta de serviços em todo o país.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[var(--angola-red)] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--angola-red)] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--angola-red)] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--angola-red)]">Links Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                Início
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                Sobre Nós
              </Link>
              <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">
                Como Funciona
              </Link>
              <Link href="/auth" className="text-gray-400 hover:text-white transition-colors text-sm">
                Registar-se
              </Link>
              <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                Ajuda
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--angola-red)]">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Termos de Serviço
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Política de Privacidade
              </Link>
              <Link href="/security" className="text-gray-400 hover:text-white transition-colors text-sm">
                Segurança
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--angola-red)]">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-[var(--angola-red)] mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p>Luanda, Angola</p>
                  <p>Município de Ingombota</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[var(--angola-red)]" />
                <span className="text-sm text-gray-400">+244 900 000 000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[var(--angola-red)]" />
                <span className="text-sm text-gray-400">contacto@jikulumessu.ao</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Jikulumessu. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-sm text-gray-400">
              Feito com ❤️ em Angola
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}