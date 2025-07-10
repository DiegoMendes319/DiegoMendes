import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Home, LogIn, House } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-[var(--angola-red)] rounded-full relative">
                <House className="w-5 h-5 text-white" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--angola-yellow)] rounded-full flex items-center justify-center">
                  <div className="w-1 h-2 bg-[var(--angola-red)] rounded-sm transform rotate-45"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Jikulumessu
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/auth" 
              className={`nav-link ${isActive('/auth') ? 'active' : ''}`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Entrar
            </Link>
            <Link 
              href="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Perfil
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-gray-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link 
                href="/auth" 
                className={`mobile-nav-link ${isActive('/auth') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Entrar
              </Link>
              <Link 
                href="/profile" 
                className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4 inline mr-2" />
                Perfil
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}