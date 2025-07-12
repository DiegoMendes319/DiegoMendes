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
import AdminPanel from "@/pages/admin";
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

function Router() {
  useScrollToTop(); // Automatically scroll to top on route changes
  
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
  if (maintenanceMode) {
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
