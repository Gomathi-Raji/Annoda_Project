import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Customize from "./pages/Customize";
import OrderForm from "./pages/OrderForm";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import UserLogin from "./pages/UserLogin";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<UserLogin />} />
          <Route element={<UserProtectedRoute />}>
            <Route path="/customize" element={<Customize />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
