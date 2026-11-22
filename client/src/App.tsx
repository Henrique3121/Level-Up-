import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SectionPage from "./pages/SectionPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/missoes"><SectionPage section="Missões" /></Route>
      <Route path="/treinos"><SectionPage section="Treinos" /></Route>
      <Route path="/cardio"><SectionPage section="Cardio" /></Route>
      <Route path="/alimentacao"><SectionPage section="Alimentação" /></Route>
      <Route path="/estudos"><SectionPage section="Estudos" /></Route>
      <Route path="/evolucao"><SectionPage section="Evolução" /></Route>
      <Route path="/recompensas"><SectionPage section="Recompensas" /></Route>
      <Route path="/perfil"><SectionPage section="Perfil" /></Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
