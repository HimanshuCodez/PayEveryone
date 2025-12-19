import { IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Exchange() {
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm md:max-w-md bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-12 relative"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-8 ring-slate-700"
            >
              <IndianRupee className="text-white" size={28} />
            </motion.div>
          </div>

          <h1 className="text-center text-2xl font-bold mt-4">Exchange Wallet</h1>

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
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                fill="#ffffff"
              />
            </svg>
          </div>
        </motion.div>

        {/* Content */}
        <div className="px-5 pt-6 pb-8 -mt-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex justify-between items-center mb-6"
          >
            <p className="text-sm font-medium text-gray-700">Available : <span className="font-bold text-lg">₹ 0</span></p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 text-sm font-semibold hover:underline"
            ><Link to="/History">
              History</Link >
            </motion.button>
          </motion.div>

          {/* Amount */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-5"
          >
            <label className="text-sm font-medium text-gray-700">Amount (INR)</label>
            <div className="flex mt-1 shadow-sm">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Minimum Amount : ₹10,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-l-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button className="px-6 border border-l-0 border-gray-300 rounded-r-xl bg-gray-100 text-gray-500 text-sm font-medium">
                ALL
              </button>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-8"
          >
            <label className="text-sm font-medium text-gray-700">Withdraw Password</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Withdraw Password"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </motion.div>

          {/* Add Bank Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link to="/bank">
              <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300">
                Click Here To Add New Bank Account
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}