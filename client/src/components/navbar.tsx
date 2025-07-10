import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, UserPlus, LogIn, User, Search } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-[var(--angola-red)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-[var(--angola-red)] rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-[var(--angola-black)]">
                Doméstica Angola
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-700 hover:text-[var(--angola-red)]">
                  <Search className="h-4 w-4 mr-2" />
                  Encontrar Diaristas
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="ghost" className="text-gray-700 hover:text-[var(--angola-red)]">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Cadastrar-se
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="text-gray-700 hover:text-[var(--angola-red)]">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Encontrar Diaristas
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="ghost" className="w-full justify-start">
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar-se
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="ghost" className="w-full justify-start">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
