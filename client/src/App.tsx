import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

// ✅ CORRECT PATH (important fix)
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Screening from "./pages/Screening";
import Results from "./pages/Results";
import Education from "./pages/Education";
import StoreMode from "./pages/StoreMode";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/screening" component={Screening} />
      <Route path="/results/:id" component={Results} />
      <Route path="/education" component={Education} />
      <Route path="/store" component={StoreMode} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
