import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from "framer-motion";

export default function WalletUI() {
  const [marketPrice, setMarketPrice] = useState('0');
  const [ourPrice, setOurPrice] = useState('0');
  const [liveRates, setLiveRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'marketData', 'prices');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMarketPrice(data.marketPrice || 'N/A');
        setOurPrice(data.ourPrice || 'N/A');
        setLiveRates(data.liveRates || []);
      } else {
        console.log("No such document!");
        setMarketPrice('Error');
        setOurPrice('Error');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm md:max-w-3xl lg:max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Top Card Header */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 md:p-10 pb-14"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-yellow-400 text-sm md:text-base"
          >
            Available Balance
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold mt-2"
          >
            $0 ≈ ₹0
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            <span className="text-sm md:text-base">Increase Your Daily Income</span>
          </motion.div>

          {/* Animated Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <svg viewBox="0 0 1440 120" className="w-full">
              <motion.path
                initial={{ d: "M0,120L1440,120L1440,120L0,120Z" }}
                animate={{
                  d: [
                    "M0,120L1440,120L1440,120L0,120Z",
                    "M0,80 C120,40 240,120 360,90 480,60 600,110 720,85 840,60 960,110 1080,90 1200,70 1320,90 1440,85 L1440,120 L0,120 Z",
                    "M0,90 C120,50 240,100 360,80 480,60 600,100 720,95 840,90 960,70 1080,100 1200,80 1320,70 1440,75 L1440,120 L0,120 Z",
                    "M0,80 C120,40 240,120 360,90 480,60 600,110 720,85 840,60 960,110 1080,90 1200,70 1320,90 1440,85 L1440,120 L0,120 Z",
                  ],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                fill="#ffffff"
              />
            </svg>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="px-5 md:px-8 pb-8 -mt-6">
          {/* Deposit / Withdrawal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-50 rounded-2xl shadow-lg p-5 md:p-7 grid grid-cols-2 divide-x divide-gray-300"
          >
            <div className="flex items-center gap-4">
              <FiUpload className="text-green-500 text-2xl md:text-3xl" />
              <div>
                <p className="text-gray-600 text-sm md:text-base">Deposit</p>
                <p className="font-bold text-lg">$0</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-6">
              <FiUpload className="text-red-500 text-2xl md:text-3xl rotate-180" />
              <div>
                <p className="text-gray-600 text-sm md:text-base">Withdrawal</p>
                <p className="font-bold text-lg">₹0</p>
              </div>
            </div>
          </motion.div>

          {/* Prices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-50 mt-5 rounded-2xl shadow-lg p-5 md:p-7 grid grid-cols-2 divide-x divide-gray-300"
          >
            <div>
              <p className="text-gray-600 text-sm md:text-base">Market Price</p>
              <p className="font-bold text-xl md:text-2xl">₹{loading ? '...' : marketPrice}</p>
            </div>
            <div className="pl-6">
              <p className="text-gray-600 text-sm md:text-base">Our Price</p>
              <p className="font-bold text-xl md:text-2xl text-green-600">₹{loading ? '...' : ourPrice}</p>
            </div>
          </motion.div>

          {/* Live Rates */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <p className="text-red-600 font-bold text-lg mb-4">Live USDT Rates</p>

            <div className="grid md:grid-cols-2 gap-5">
              {loading ? (
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="col-span-full text-center text-gray-500"
                >
                  Loading rates...
                </motion.p>
              ) : liveRates.length > 0 ? (
                liveRates.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-slate-50 rounded-2xl shadow-lg p-5 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${item.bg || 'bg-gray-400'}`}
                      >
                        {item.name ? item.name[0] : '?'}
                      </motion.div>
                      <div>
                        <p className="font-bold text-lg">{item.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">USDT</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{item.price || 'N/A'}</p>
                      <p className={`text-sm font-medium ${item.color || 'text-gray-500'}`}>
                        {item.change || 'N/A'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No live rates available.</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}