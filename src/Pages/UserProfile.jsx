import { ArrowLeft, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";

export default function UserProfile() {
  const user = useAuthStore((state) => state.user);

  const referralCode = user?.referralCode || "N/A";
  const invitationLink = user?.uid 
    ? `https://payeveryone.in/register?refer=${user.referralCode || ''}`
    : "N/A";

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(message),
      () => toast.error("Failed to copy.")
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center">
        <p className="text-gray-600">Loading user data or not logged in...</p>
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
          <Link to="/Profile" className="absolute top-6 left-5">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={28} />
            </motion.div>
          </Link>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-2xl font-bold"
          >
            User Details
          </motion.h2>

          {/* Animated Wave */}
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
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                fill="#ffffff"
              />
            </svg>
          </div>
        </motion.div>

        {/* User Details */}
        <div className="px-5 pt-6 pb-10 -mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-5"
          >
            <DetailItem
              label="Full Name"
              value={user.name || "N/A"}
            />
            <DetailItem
              label="Email"
              value={user.email || "N/A"}
            />
            <DetailItem
              label="Phone Number"
              value={user.phoneNumber || "N/A"}
            />
            <DetailItem
              label="Invitation Code"
              value={referralCode}
              onCopy={() => copyToClipboard(referralCode, "Invitation code copied!")}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-slate-100 rounded-2xl px-5 py-4 shadow-inner"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Invitation Link</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-800 truncate flex-1 font-mono">
                  {invitationLink}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(invitationLink, "Invitation link copied!")}
                  className="text-blue-600"
                >
                  <Copy size={20} />
                </motion.button>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => copyToClipboard(invitationLink, "Invitation link copied!")}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300"
            >
              Copy Referral Link
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function DetailItem({ label, value, onCopy }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="bg-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm"
    >
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-900">{value}</span>
        {onCopy && (
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCopy}
            className="text-blue-600"
          >
            <Copy size={20} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}