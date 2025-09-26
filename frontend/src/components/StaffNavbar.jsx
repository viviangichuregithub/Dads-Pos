"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Home, ShoppingCart, Settings, LogOut, Menu, X, User } from "lucide-react";
import Image from "next/image";

export default function StaffNavbar() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Dashboard", icon: <Home size={18} />, href: "/staff/dashboard_staff" },
    { name: "Sales", icon: <ShoppingCart size={18} />, href: "/staff/sale" },
    { name: "Profile", icon: <User size={18} />, href: "/staff/profile" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleNavigate = (href) => {
    router.push(href);
    setMobileMenuOpen(false); 
  };

  return (
    <nav className="bg-gray-950 text-white shadow-md border-b border-gray-800 sticky top-0 z-50">
      <div className="hidden md:flex justify-between items-center px-8 py-3">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => router.push("/staff/dashboard")}
        >
          <Image
            src="/shoe_logo.jpg"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full border-2 border-orange-400"
          />
          <span className="text-2xl font-bold text-orange-400">Shoe World Base</span>
        </div>
        <div className="flex space-x-2">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavigate(link.href)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-900 hover:text-orange-400 transition-colors duration-200 font-medium"
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-blue-500 hover:text-white transition-colors duration-200 font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="flex md:hidden justify-between items-center px-4 py-3 border-b border-gray-800">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/staff/dashboard_staff")}
        >
          <Image
            src="/shoe_logo.jpg"
            alt="Logo"
            width={36}
            height={36}
            className="rounded-full border border-orange-400"
          />
          <span className="text-lg font-bold text-orange-400">ShoePOS</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:text-orange-400 transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800 px-4 py-4 space-y-2 animate-slideDown">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavigate(link.href)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left hover:bg-gray-900 hover:text-orange-400 transition-colors duration-200 font-medium"
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg w-full bg-gray-900 hover:bg-blue-500 hover:text-white transition-colors duration-200 font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
