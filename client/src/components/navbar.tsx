import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Home, LogIn } from "lucide-react";
import JikulumessuIcon from "./jikulumessu-icon";
import ThemeToggle from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    if (user) {
      // Utilizador está autenticado, redirecionar para perfil
      setLocation("/profile");
    } else {
      // Utilizador não está autenticado, mostrar mensagem
      toast({
        title: "Acesso Restrito",
        description: "Deve primeiro conectar-se para aceder ao seu perfil.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <JikulumessuIcon size="lg" className="text-white" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Jikulumessu
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/auth" 
              className={`nav-link ${isActive('/auth') ? 'active' : ''}`}
              data-tutorial="auth-link"
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Entrar
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProfileClick}
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Perfil
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-300"
              data-tutorial="mobile-menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/auth" 
                className={`mobile-nav-link ${isActive('/auth') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Entrar
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleProfileClick();
                  setIsMenuOpen(false);
                }}
                className={`w-full justify-start mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Perfil
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}