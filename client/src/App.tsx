import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Login from "@/pages/login";
import AuthCallback from "@/pages/auth-callback";
import Profile from "@/pages/profile";
import AdminPanel from "@/pages/admin-simple";
import AdminLogin from "@/pages/admin-login";
import ChangePassword from "@/pages/change-password";
import RecoverPassword from "@/pages/recover-password";
import ServerErrorPage from "@/pages/server-error";
import NotFound from "@/pages/not-found";
import MaintenancePage from "@/pages/maintenance";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import About from "@/pages/about";
import HowItWorks from "@/pages/how-it-works";
import Help from "@/pages/help";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Security from "@/pages/security";
import Messages from "@/pages/messages";
import { useEffect } from "react";
import { loadSiteColors } from "@/utils/colorSystem";

function Router() {
  useScrollToTop(); // Automatically scroll to top on route changes
  
  // Load site colors on app startup
  useEffect(() => {
    loadSiteColors();
  }, []);
  
  // Check if maintenance mode is active
  const { data: maintenanceMode } = useQuery({
    queryKey: ['/api/maintenance-mode'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/maintenance-mode');
        if (!response.ok) return false;
        const data = await response.json();
        return data.enabled;
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
        return false;
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1,
  });

  // Show maintenance page if maintenance mode is active
  // But allow access to admin login page
  if (maintenanceMode && window.location.pathname !== '/admin-login') {
    return <MaintenancePage />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/login" component={Login} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/profile" component={Profile} />
          <Route path="/about" component={About} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/help" component={Help} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/security" component={Security} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/messages" component={Messages} />
          <Route path="/change-password" component={ChangePassword} />
          <Route path="/recover-password" component={RecoverPassword} />
          <Route path="/server-error" component={ServerErrorPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
