import { useState } from "react";
import { Button } from "./ui/enhanced-button";
import { WalletConnect } from "./WalletConnect";
import { 
  BarChart3, 
  Vote, 
  Plus, 
  Settings, 
  Zap,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'proposals', label: 'Proposals', icon: Vote },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'ai-insights', label: 'AI Insights', icon: Zap },
  ];

  return (
    <nav className="border-b border-border bg-card/30 backdrop-blur-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI DAO
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "ai" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab?.(item.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Desktop Wallet */}
          <div className="hidden md:block">
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "ai" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setActiveTab?.(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 justify-start w-full"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
            <div className="pt-4 border-t border-border">
              <WalletConnect />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};