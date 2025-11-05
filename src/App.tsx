
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Canvas from "./pages/Canvas";
// About, Terms, Privacy are now handled by ContentPage
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Upload from "./pages/Upload";
import Prepare from "./pages/Prepare";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { UserProvider } from "@/contexts/UserContext";
import Confirm from "./pages/Confirm";
import BlockDetail from "./pages/BlockDetail";
import HowItWorksPage from "./pages/HowItWorksPage";
import ContentPage from "./pages/ContentPage";
import GA4Provider from "./components/GA4Provider";
import AdminPage from "./pages/admin/AdminPage";
import TVPage from "./pages/tv/TVPage";
import MobilePage from "./pages/mobile/MobilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <GA4Provider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* Nouvelle page : Comment ça marche */}
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/canvas" element={<Canvas />} />
              <Route path="/about" element={<ContentPage pageName="about" />} />
              <Route path="/terms" element={<ContentPage pageName="terms" />} />
              <Route path="/privacy" element={<ContentPage pageName="privacy" />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/upload" element={<Upload />} />
              {/* Auth page */}
              <Route path="/auth" element={<Auth />} />
              {/* Profile page */}
              <Route path="/profile" element={<Profile />} />
              {/* Nouvelle page */}
              <Route path="/prepare" element={<Prepare />} />
              <Route path="/confirm" element={<Confirm />} />
              {/* Nouvelle route lien partagé block */}
              <Route path="/block/:x/:y" element={<BlockDetail />} />
              {/* Music Quiz Routes */}
              <Route path="/quiz/admin" element={<AdminPage />} />
              <Route path="/tv/:gameId" element={<TVPage />} />
              <Route path="/mobile" element={<MobilePage />} />
              {/* CATCH-ALL */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GA4Provider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
