import { useState } from "react";
import { Bike, Menu, X, LogIn, LogOut, UserPlus } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export function Header({ currentPage, onNavigate, isLoggedIn, isAdmin, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Início" },
    { id: "services", label: "Serviços" },
    { id: "shop", label: "Loja de Motas" },
    { id: "parts", label: "Peças" },
    { id: "booking", label: "Marcações" },
    { id: "contact", label: "Contacto" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Bike className="w-8 h-8 text-blue-600" />
            <span className="text-gray-900">MotaRoad</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-colors ${
                  currentPage === item.id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            ))}
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onNavigate("admin-inventory")}>
                      Gerir Loja
                    </Button>
                    <Button variant="outline" onClick={() => onNavigate("admin-bookings")}>
                      Marcações
                    </Button>
                  </div>
                )}
                <Button variant="outline" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="default" size="lg" onClick={() => onNavigate("login")}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button variant="default" size="lg" onClick={() => onNavigate("register")}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registar
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onNavigate("admin-inventory");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Gerir Loja
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onNavigate("admin-bookings");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Marcações
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => {
                    onNavigate("login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => {
                    onNavigate("register");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registar
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
