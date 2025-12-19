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
        
      <Link
  to="/"
  onClick={handleLogoClick}
  className="flex items-center gap-3 group"
>
  {/* Logo Icon */}
  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
    <img
      src="/logo.png"
      alt="PayEveryone Logo"
      className="w-full h-full object-contain"
    />
  </div>

  {/* Brand Name */}
  <span className="text-xl md:text-2xl font-extrabold tracking-tight">
    <span className="text-black">Pay</span>
    <span className="text-blue-600">Everyone</span>
  </span>
</Link>


        {/* Notification */}
        <div className="flex items-center">
          <AiOutlineBell className="text-2xl cursor-pointer text-gray-600 hover:text-gray-900" />
        </div>
      </div>
    </header>
  );
}
