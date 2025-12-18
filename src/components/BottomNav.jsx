import React from "react";
import { AiOutlineHome, AiOutlineSwap } from "react-icons/ai";
import { FiDownload, FiUser } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-3 z-50">
      <Link to="/">
        <AiOutlineHome
          className={`text-xl ${
            pathname === "/" ? "text-blue-500" : "text-gray-400"
          }`}
        />
      </Link>
      <Link to="/Deposit">
        <FiDownload
          className={`text-xl ${
            pathname === "/Deposit" ? "text-blue-500" : "text-gray-400"
          }`}
        />
      </Link>
      <Link to="/Exchange">
        <AiOutlineSwap
          className={`text-xl ${
            pathname === "/Exchange" ? "text-blue-500" : "text-gray-400"
          }`}
        />
      </Link>
      <Link to="/Profile">
        <FiUser
          className={`text-xl ${
            pathname === "/Profile" ? "text-blue-500" : "text-gray-400"
          }`}
        />
      </Link>
    </div>
  );
}
