import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Home, LogIn, LogOut, ChevronDown, Shield, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import JikulumessuIcon from "./jikulumessu-icon";
import ThemeToggle from "./theme-toggle";
import FeedbackModal from "./feedback-modal";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const { getSetting } = useSiteSettings();
  
  // Get unread message count for authenticated users
  const { data: unreadCount } = useQuery({
    queryKey: ['/api/messages/unread-count'],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleConnectClick = () => {
    if (user) {
      // Utilizador está autenticado, redirecionar para perfil
      setLocation("/profile");
    } else {
      // Utilizador não está autenticado, redirecionar para página de login
      setLocation("/login");
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({
          title: "Logout realizado com sucesso",
          description: "Até breve!",
        });
        
        // Force page reload to update auth state
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        throw new Error('Erro ao fazer logout');
      }
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Tente novamente",
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
                {getSetting('site_name', 'Jikulumessu')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!user && (
              <Link 
                href="/auth" 
                className={`nav-link ${isActive('/auth') ? 'active' : ''}`}
                data-tutorial="register-link"
              >
                <User className="w-4 h-4 inline mr-2" />
                Registar
              </Link>
            )}
            
            {/* Messages link for authenticated users */}
            {user && (
              <Link 
                href="/messages" 
                className={`nav-link ${isActive('/messages') ? 'active' : ''} relative`}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Mensagens
                {unreadCount && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center unread-badge">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Connection Status */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="nav-link"
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    {user.name}
                    <ChevronDown className="w-4 h-4 inline ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLocation("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Ver Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/messages")}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Mensagens
                    {unreadCount && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsFeedbackOpen(true)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Feedback
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => setLocation("/admin")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Painel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleConnectClick}
                className="nav-link"
                data-tutorial="connect-link"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Conectar-se
              </Button>
            )}
            
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
              {!user && (
                <Link 
                  href="/auth" 
                  className={`mobile-nav-link ${isActive('/auth') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Registar
                </Link>
              )}
              
              {/* Mobile Connection Status */}
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLocation("/profile");
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start mobile-nav-link"
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Ver Perfil
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLocation("/messages");
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start mobile-nav-link"
                  >
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Mensagens
                    {unreadCount && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsFeedbackOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start mobile-nav-link"
                  >
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Feedback
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLocation("/admin");
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start mobile-nav-link"
                    >
                      <Shield className="w-4 h-4 inline mr-2" />
                      Painel Admin
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start mobile-nav-link"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleConnectClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start mobile-nav-link"
                >
                  <LogIn className="w-4 h-4 inline mr-2" />
                  Conectar-se
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsFeedbackOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full justify-start mobile-nav-link"
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Feedback
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </nav>
  );
}