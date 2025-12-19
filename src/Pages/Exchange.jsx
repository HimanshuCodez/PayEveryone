import { IndianRupee, History, Wallet, ArrowDownUp, Sparkles, Lock, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Exchange() {
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 -top-20 -left-20"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 150, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-20 bottom-0 right-0"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-64 h-64 bg-indigo-500 rounded-full blur-2xl opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 pt-8 px-6"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20"
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Exchange Wallet
            </h1>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="flex items-center gap-4"
          >
            <div className="text-right">
              <p className="text-sm text-gray-300">Available Balance</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                <IndianRupee className="w-6 h-6" />0
              </p>
            </div>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
              <Wallet className="w-10 h-10 text-purple-400" />
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Wave Section */}
      <div className="relative h-32 overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ d: "M0,320L1440,320L1440,320L0,320Z" }}
            animate={{
              d: [
                "M0,320L1440,320L1440,320L0,320Z",
                "M0,200L480,250L960,180L1440,220L1440,320L0,320Z",
                "M0,220L480,180L960,250L1440,200L1440,320L0,320Z",
                "M0,320L1440,320L1440,320L0,320Z",
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            fill="rgba(139, 92, 246, 0.3)"
          />
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 -mt-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* History Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <History className="w-8 h-8 text-cyan-400" />
                Transaction History
              </h2>
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <ArrowDownUp className="w-6 h-6 text-gray-300" />
              </motion.div>
            </div>
            <p className="text-gray-300 text-center py-12">No transactions yet. Start withdrawing!</p>
          </motion.div>

          {/* Withdrawal Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Withdraw Funds
            </h2>

            {/* Amount Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-green-400" />
                Amount (INR)
              </label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-white/10 border border-white/30 rounded-2xl px-6 py-5 text-xl focus:outline-none focus:border-cyan-400 transition-all"
                />
                {amount && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-cyan-400"
                  >
                    ₹
                  </motion.span>
                )}
              </motion.div>
            </div>

            {/* Password Input */}
            <div className="mb-10">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-400" />
                Withdraw Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/30 rounded-2xl px-6 py-5 text-xl focus:outline-none focus:border-pink-400 transition-all"
              />
            </div>

            {/* Add Bank Account */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-center"
            >
              <Link
                to="/add-bank"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-5 rounded-full text-lg font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                <PlusCircle className="w-6 h-6" />
                Click Here To Add New Bank Account
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}