"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  BookOpen,
  Users,
  Bell,
  BarChart3,
  LogOut,
  Menu,
  X,
  Calendar, // 👈 Added Calendar Icon for Batches
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { label: "Assets", href: "assets", icon: ImageIcon },
  { label: "Courses", href: "courses", icon: BookOpen },
  { label: "Batches", href: "batches", icon: Calendar }, // 👈 Added Batches here
  { label: "Faculty", href: "faculty", icon: Users },
  { label: "Notifications", href: "notifications", icon: Bell },
  { label: "Analytics", href: "analytics", icon: BarChart3 },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      
      {/* 🔹 DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col fixed inset-y-0 z-20">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-20 rounded-[15%] overflow-hidden shadow-sm border border-white">
              <img src="/logo.jpg" alt="Icon" className="w-full h-full object-contain" />
            </div>
            <div>
              <img src="/brand.jpg" alt="Abhinna" className="h-8 object-contain" />
              <p className="font-script text-[#D4AF37] text-xs tracking-tight italic">
                A destination of Art & Academia
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname.includes(`/${item.href}`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#003153] text-white shadow-md shadow-blue-900/20"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={18} className={active ? "text-[#D4AF37]" : "text-slate-400"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            Logout 
          </button>
        </div>
      </aside>

      {/* 🔹 MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div 
        className={`fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-[100] transform transition-transform duration-300 ease-out md:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg overflow-hidden border border-white bg-white">
                 <img src="/logo.jpg" alt="Icon" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-slate-700">Admin Menu</span>
           </div>
           <button 
             onClick={() => setIsMobileMenuOpen(false)} 
             className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname.includes(`/${item.href}`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#003153] text-white shadow-md shadow-blue-900/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={20} className={active ? "text-[#D4AF37]" : "text-slate-400"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            Logout 
          </button>
        </div>
      </div>

      {/* 🔹 MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-72 transition-all duration-300">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-[#003153] transition-colors"
              aria-label="Open Menu"
            >
              <Menu size={28} />
            </button>

            <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest truncate">
              {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                ADM
             </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}