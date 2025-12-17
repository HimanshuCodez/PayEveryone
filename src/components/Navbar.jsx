import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { getAuth, signOut } from "firebase/auth";
import { AiOutlineBell } from "react-icons/ai";

export default function Navbar() {
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-3 group"
        >
          <img
            src="/logo.png"
            alt="PayEveryone"
            className="h-12 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />

        
        </Link>

        {/* Notification */}
        <div className="flex items-center">
          <AiOutlineBell className="text-2xl cursor-pointer text-gray-600 hover:text-gray-900" />
        </div>
      </div>
    </header>
  );
}
