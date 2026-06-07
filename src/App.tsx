import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  UserCheck,
  Syringe,
  Boxes,
  Scan,
  Bell,
  MessageSquareQuote,
  BarChart3,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  Heart,
  Smartphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import modules
import { DashboardView } from "./components/DashboardView";
import { PatientsView } from "./components/PatientsView";
import { VaccinationsView } from "./components/VaccinationsView";
import { InventoryView } from "./components/InventoryView";
import { ScannerView } from "./components/ScannerView";
import { NotificationsView } from "./components/NotificationsView";
import { TestimonialsView } from "./components/TestimonialsView";
import { ReportsView } from "./components/ReportsView";

export default function App() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // Theme state: default to dark-mode based on specifications (#0F172A)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("nih-theme");
    return saved !== "light"; // default is dark
  });

  // Sidebar collapsable states on desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync theme to root class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("nih-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("nih-theme", "light");
    }
  }, [isDarkMode]);

  const menuItems = [
    { id: "dashboard", label: "Operations Room", icon: LayoutDashboard },
    { id: "patients", label: "Patient POS Registry", icon: UserCheck },
    { id: "vaccinations", label: "EPI Schedules & Protocols", icon: Syringe },
    { id: "inventory", label: "Cold Chain Supply", icon: Boxes },
    { id: "scanner", label: "QR Barcode Lens", icon: Scan },
    { id: "notifications", label: "Bilingual Alerts", icon: Bell },
    { id: "testimonials", label: "Community Advocacy", icon: MessageSquareQuote },
    { id: "reports", label: "Epidemic Intelligence", icon: BarChart3 },
  ];

  // Dynamically render active view
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "patients":
        return <PatientsView />;
      case "vaccinations":
        return <VaccinationsView />;
      case "inventory":
        return <InventoryView />;
      case "scanner":
        return <ScannerView />;
      case "notifications":
        return <NotificationsView />;
      case "testimonials":
        return <TestimonialsView />;
      case "reports":
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      
      {/* 1. Mobile Top Navigation Bar */}
      <header className="md:hidden w-full bg-slate-900 border-b border-white/5 p-4 flex items-center justify-between z-40 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-slate-900">
            NIH
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">NIH Pakistan</h1>
            <p className="text-[9px] text-slate-400">National Immunization Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-350"
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 text-primary" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-350"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Responsive Desktop Left Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-slate-900 border-r border-white/5 shadow-md shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-4 space-y-6">
          
          {/* Executive Government Branding */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? "justify-center w-full" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-extrabold text-slate-905 shadow-md">
                🇵🇰
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h2 className="text-sm font-extrabold tracking-tight text-white uppercase">NIH Portal</h2>
                  <p className="text-[10px] text-primary/75 font-mono">GOVERNMENT LEVEL</p>
                </div>
              )}
            </div>

            {/* Sidebar toggle button */}
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
            )}
            {sidebarCollapsed && (
              <div className="absolute left-16 z-50">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-1 bg-primary text-slate-900 rounded-full hover:bg-primary-hover shadow"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                    active
                      ? "bg-primary text-slate-910 font-bold shadow-lg shadow-primary/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-850"
                  } ${sidebarCollapsed ? "justify-center" : "justify-start"}`}
                  title={item.label}
                >
                  <IconComp className="w-5.0 h-5.0 shrink-0" />
                  {!sidebarCollapsed && <span className="text-xs truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Footer (Ministry identity) */}
        <div className="p-4 border-t border-white/5 space-y-4">
          
          {/* Quick theme control on sidebar footer */}
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between bg-slate-850 p-2 rounded-xl text-xs text-slate-300">
              <span>Theme choice</span>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1 rounded bg-slate-800 hover:text-primary"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          )}

          <div className="text-center text-[10px] text-slate-500 font-mono">
            {!sidebarCollapsed ? (
              <div className="space-y-1">
                <span className="block text-slate-400">© 2026 MNHSRC Pakistan</span>
                <span className="block opacity-75">Integrated EPI Server 4.1</span>
              </div>
            ) : (
              <span>🇵🇰</span>
            )}
          </div>
        </div>
      </aside>

      {/* 3. Mobile Navigation Overlay Slide Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-slate-950/80 z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="w-4/5 max-w-sm bg-slate-900 h-full p-6 flex flex-col justify-between text-white"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇵🇰</span>
                    <strong className="text-sm font-bold uppercase tracking-wider text-white">NIH Pakistan</strong>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* nav and options */}
                <nav className="space-y-1.5 flex-1 max-h-[70vh] overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                          active ? "bg-primary text-slate-900 font-extrabold" : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-80a pt-4">
                <p className="text-[10px] text-slate-500 text-center font-mono uppercase">
                  Lady Health Worker Net (EPI)
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Core Active View Workspace */}
      <main className="flex-1 overflow-y-auto max-h-screen custom-scrollbar flex flex-col justify-between">
        
        {/* Dynamic header title widget depending on route selection */}
        <div className="bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-800/80 p-4 px-6 md:px-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors">
          <div>
            <span className="text-[9px] tracking-wider uppercase font-mono text-secondary dark:text-primary font-bold">
              EPI National Vaccine Deployment Ecosystem
            </span>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className="w-5 h-5 text-[#005F73]" />
              <h2 className="text-md font-bold text-slate-900 dark:text-zinc-150">
                National Immunization Hub (NIH) Pakistan
              </h2>
            </div>
          </div>

          <div className="text-[10px] bg-[#005F73]/10 dark:bg-primary/10 border dark:border-primary/20 text-slate-800 dark:text-primary p-2 px-3 rounded-lg flex items-center gap-2 shrink-0 font-mono">
            <span className="w-2 h-2 rounded bg-emerald-500 animate-ping"></span>
            <span>SECURE EPI SERVER ONLINE [OK]</span>
          </div>
        </div>

        {/* View Workspace Segment Component Wrapper */}
        <div className="flex-1 p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Human-centric humbler corporate page footer */}
        <footer className="bg-white dark:bg-dark-card border-t border-slate-205 dark:border-slate-800/80 p-4 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between gap-3 font-medium transition-colors">
          <span>Developed under Expanded Programme on Immunization (EPI) guidelines.</span>
          <span className="flex items-center justify-center gap-1">
            Ministry of National Health Services, Regulations & Coordination, Government of Pakistan
          </span>
        </footer>

      </main>

    </div>
  );
}
