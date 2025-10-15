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
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<number | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

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
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
