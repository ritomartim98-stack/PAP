import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { ShopPage } from "./pages/ShopPage";
import { MotorcycleDetailPage } from "./pages/MotorcycleDetailPage";
import { PartsPage } from "./pages/PartsPage";
import { BookingPage } from "./pages/BookingPage";
import { ContactPage } from "./pages/ContactPage";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { AdminBookingsPage } from "./pages/AdminBookingsPage";
import { AdminInventoryPage } from "./pages/AdminInventoryPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<number | null>(null);
  const [cartItemsCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshAuthState = () => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      setIsAdmin(loggedIn && user?.perfil === 'admin');
    } catch {
      setIsAdmin(false);
    }
  };

  // Check login status on mount
  useEffect(() => {
    refreshAuthState();
  }, []);

  // Smooth scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleNavigate = (page: string, motorcycleId?: number) => {
    setCurrentPage(page);
    if (motorcycleId !== undefined) {
      setSelectedMotorcycleId(motorcycleId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('clientId');
    localStorage.removeItem('user');
    localStorage.removeItem('admin_auth');
    setIsLoggedIn(false);
    setIsAdmin(false);
    handleNavigate('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "services":
        return <ServicesPage onNavigate={handleNavigate} />;
      case "shop":
        return <ShopPage onNavigate={handleNavigate} />;
      case "motorcycle-detail":
        return selectedMotorcycleId ? (
          <MotorcycleDetailPage motorcycleId={selectedMotorcycleId} onNavigate={handleNavigate} />
        ) : (
          <ShopPage onNavigate={handleNavigate} />
        );
      case "parts":
        return <PartsPage />;
      case "booking":
        return <BookingPage />;
      case "contact":
        return <ContactPage />;
      case "login":
        return <LoginPage onNavigate={handleNavigate} onLogin={refreshAuthState} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} onRegister={refreshAuthState} />;
      case "admin-bookings":
        return isAdmin ? <AdminBookingsPage onNavigate={handleNavigate} /> : <HomePage onNavigate={handleNavigate} />;
      case "admin-inventory":
        return isAdmin ? <AdminInventoryPage onNavigate={handleNavigate} /> : <HomePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartItemsCount={cartItemsCount}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
