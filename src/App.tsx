import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FormPage from "./pages/FormPage";
import { ThemeProvider } from "./lib/ThemeProvider";
import { useEffect, useState } from "react";

// Protected route component to check if user has filled out the form
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userProfile = localStorage.getItem('userProfile');
  
  if (!userProfile) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  // This ensures we can access localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // Returning null on first render to avoid hydration issues
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Form page as initial route */}
              <Route path="/" element={<FormPage />} />
              
              {/* Protected Chat route */}
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
