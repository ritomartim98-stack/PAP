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
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<number | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
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
    setIsLoggedIn(false);
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
        return <LoginPage onNavigate={handleNavigate} onLogin={() => setIsLoggedIn(true)} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} onRegister={() => setIsLoggedIn(true)} />;
      case "admin-bookings":
        return <AdminBookingsPage onNavigate={handleNavigate} />;
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
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
