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
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-14 relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center ring-8 ring-slate-700 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-800">
                  {user.fullName ? user.fullName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xl font-semibold"
          >
            {user.name || user.email || "User"}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center items-center gap-2 mt-2 text-sm text-gray-300"
          >
            <span>User ID : {user.phoneNumber ? user.phoneNumber.substring(0, 6) : "N/A"}</span>
            <Copy size={16} className="cursor-pointer hover:text-white transition" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center mt-5"
          >
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all duration-300">
              Invite & Earn 0.3% On Every Deposit
            </button>
          </motion.div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <svg viewBox="0 0 1440 120" className="w-full">
              <motion.path
                initial={{ d: "M0,120L1440,120L1440,120L0,120Z" }}
                animate={{
                  d: [
                    "M0,120L1440,120L1440,120L0,120Z",
                    "M0,80L60,74.7C120,69,240,59,360,48C480,37,600,27,720,37.3C840,48,960,80,1080,85.3C1200,91,1320,69,1380,58.7L1440,48L1440,120L0,120Z",
                    "M0,90L60,82C120,74,240,58,360,52C480,46,600,50,720,45.3C840,41,960,28,1080,32C1200,36,1320,58,1380,69.3L1440,80L1440,120L0,120Z",
                    "M0,80L60,74.7C120,69,240,59,360,48C480,37,600,27,720,37.3C840,48,960,80,1080,85.3C1200,91,1320,69,1380,58.7L1440,48L1440,120L0,120Z",
                  ],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                fill="#ffffff"
              />
            </svg>
          </div>
        </motion.div>

        {/* Menu */}
        <div className="px-5 py-6 -mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <Link to="/UserProfile">
              <MenuItem icon={<User size={20} />} text="Personal" />
            </Link>
             <Link to="/Teams">
            <MenuItem icon={<Users size={20} />} text="Referral Team" /></Link>
            <Link to="/Ranking">
              <MenuItem icon={<BarChart2 size={20} />} text="Ranking" />
            </Link>
            <Link to="/History">
              <MenuItem icon={<History size={20} />} text="Transaction History" />
            </Link>
            <Link to="/Withdraw">
              <MenuItem icon={<DollarSign size={20} />} text="USDT Withdrawal" />
            </Link>
            <Link to="/bank">
              <MenuItem icon={<Building2 size={20} />} text="Manage Bank Account" />
            </Link>
            <Link to="/password">
              <MenuItem icon={<Lock size={20} />} text="Update Profile Password" />
            </Link>
            <Link to="/help">
              <MenuItem icon={<HelpCircle size={20} />} text="Help" />
            </Link>
            <MenuItem icon={<LogOut size={20} />} text="Logout" danger onClick={handleLogout} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function MenuItem({ icon, text, danger, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 8 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-medium cursor-pointer transition-all shadow-sm
        ${danger ? "text-red-600 bg-red-50" : "text-gray-800 bg-slate-100"}`}
      onClick={onClick}
    >
      <div className={`${danger ? "text-red-600" : "text-blue-600"}`}>
        {icon}
      </div>
      <span>{text}</span>
    </motion.div>
  );
}