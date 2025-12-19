import { useState } from "react";
import { Users, DollarSign, Copy, MessageCircle, Send, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Teams() {
  // Sample data - replace with real data from your store/Firebase
  const teamUser = 1;
  const todayUser = 0;
  const totalReward = 0;
  const todayReward = 0;
  const referralLink = "https://payeveryone.in/register?refer=246520";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText("246520");
    toast.success("Referral code copied!");
  };

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
          className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-6 pt-8 pb-10"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-2xl font-bold mb-8"
          >
            User Details
          </motion.h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 flex items-center gap-4 shadow-lg"
            >
              <Users className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-90">Team User</p>
                <p className="text-2xl font-bold">{teamUser}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 flex items-center gap-4 shadow-lg"
            >
              <Users className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-90">Today User</p>
                <p className="text-2xl font-bold">{todayUser}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 flex items-center gap-4 shadow-lg"
            >
              <DollarSign className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-90">Total Reward</p>
                <p className="text-2xl font-bold">${totalReward}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4 flex items-center gap-4 shadow-lg"
            >
              <DollarSign className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-90">Today Reward</p>
                <p className="text-2xl font-bold">${todayReward}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="px-6 py-8 -mt-6">
          {/* Promo Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 flex items-center gap-6 shadow-lg mb-8"
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Invite your Clients And Get
              </h3>
              <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                0.3% ON Every Deposit
              </p>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32"
            >
              <img
                src="data:image/jpeg;base64,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"
                alt="Invite"
                className="w-full h-full object-contain"
              />
              {/* Replace above with actual illustration or use SVG */}
            </motion.div>
          </motion.div>

          {/* Referral Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Invitation Link</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyReferralCode}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md"
              >
                Copy Referral
              </motion.button>
            </div>

            <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3">
              <p className="text-sm text-gray-700 truncate flex-1">
                {referralLink}
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyLink}
                className="text-blue-600"
              >
                <Copy size={20} />
              </motion.button>
            </div>
          </motion.div>

          {/* Share Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-3 gap-4"
          >
            <motion.a
              href={`https://wa.me/?text=${encodeURIComponent("Join now and earn! " + referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white rounded-2xl py-5 flex flex-col items-center gap-2 shadow-lg"
            >
              <MessageCircle size={28} />
              <span className="text-sm font-medium">WhatsApp</span>
            </motion.a>

            <motion.a
              href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join and earn rewards!")}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-5 flex flex-col items-center gap-2 shadow-lg"
            >
              <Send size={28} />
              <span className="text-sm font-medium">Telegram</span>
            </motion.a>

            <motion.a
              href={`sms:?body=${encodeURIComponent("Check this out: " + referralLink)}`}
              whileHover={{ scale: 1.1, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl py-5 flex flex-col items-center gap-2 shadow-lg"
            >
              <Phone size={28} />
              <span className="text-sm font-medium">SMS</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}