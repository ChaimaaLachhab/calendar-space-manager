

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import axios from "axios";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Spaces from "./pages/Spaces";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SpaceDetail from "./pages/SpaceDetail";
import UserProfile from "./pages/UserProfile";  
import Dashboard from "./pages/admin/Dashboard";
import AddEditSpace from "./pages/admin/AddEditSpace";
import { spacesAPI } from "./services/api";

axios.interceptors.response.use(
  (response) => {
    return new Promise(resolve => setTimeout(() => resolve(response), 500));
  },
  (error) => {
    return Promise.reject(error);
  }
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/spaces" element={<Spaces />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/spaces/:id" element={<SpaceDetail />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/spaces/new" element={<AddEditSpace />} />
                <Route path="/admin/spaces/:id/edit" element={<AddEditSpace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App
