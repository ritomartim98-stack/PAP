import { useState } from "react";
import { Bike, Menu, X, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItemsCount?: number;
}

export function Header({ currentPage, onNavigate, cartItemsCount = 0 }: HeaderProps) {
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
            <span className="text-gray-900">MotoOficina Premium</span>
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
            <button
              onClick={() => onNavigate("parts")}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </button>
            <Button onClick={() => onNavigate("booking")}>
              <Calendar className="w-4 h-4 mr-2" />
              Agendar
            </Button>
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
            <Button
              onClick={() => {
                onNavigate("booking");
                setMobileMenuOpen(false);
              }}
              className="w-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Agora
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
