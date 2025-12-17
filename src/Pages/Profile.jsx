import {
  User,
  Users,
  BarChart2,
  History,
  DollarSign,
  Building2,
  Lock,
  HelpCircle,
  LogOut,
  Copy,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center">
        <p>Loading user data or not logged in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative">
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center ring-4 ring-slate-700">
              <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-800">
                  {user.fullName ? user.fullName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-center text-lg font-semibold">{user.fullName || user.email || "User"}</h2>

          <div className="flex justify-center items-center gap-2 mt-1 text-sm text-gray-300">
            <span>User ID : {user.uid ? user.uid.substring(0, 6) : "N/A"}</span>
            <Copy size={14} />
          </div>

          <div className="flex justify-center mt-4">
            <button className="bg-blue-500 px-4 py-2 rounded-full text-sm font-semibold">
              Invite & Earn 0.3% On Every Deposit
            </button>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 120" className="w-full">
              <path
                fill="#ffffff"
                d="M0,80L60,74.7C120,69,240,59,360,48C480,37,600,27,720,37.3C840,48,960,80,1080,85.3C1200,91,1320,69,1380,58.7L1440,48L1440,120L0,120Z"
              />
            </svg>
          </div>
        </div>

        {/* Menu */}
        <div className="px-4 py-4 space-y-2">
          <Link to="/UserProfile">
            <MenuItem icon={<User size={18} />} text="Personal" />
          </Link>
          <MenuItem icon={<Users size={18} />} text="Referral Team" />
          <Link to="/Ranking">
            <MenuItem icon={<BarChart2 size={18} />} text="Ranking" />
          </Link>
          <Link to="/History">
            <MenuItem icon={<History size={18} />} text="Transaction History" />
          </Link>
          <Link to="/Withdraw">
            <MenuItem icon={<DollarSign size={18} />} text="USDT Withdrawal" />
          </Link>
          <Link to="/bank">
            <MenuItem icon={<Building2 size={18} />} text="Manage Bank Account" />
          </Link>
          <Link to="/password">
            <MenuItem icon={<Lock size={18} />} text="Update Profile Password" />
          </Link>
          <Link to="/help">
            <MenuItem icon={<HelpCircle size={18} />} text="Help" />
          </Link>
          <MenuItem icon={<LogOut size={18} />} text="Logout" danger onClick={handleLogout} />
        </div>

      </div>
    </div>
  );
}

function MenuItem({ icon, text, danger, onClick }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm cursor-pointer
      ${danger ? "text-red-500" : "text-gray-700"}
      bg-slate-100`}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
