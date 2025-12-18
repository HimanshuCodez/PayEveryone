import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path if necessary

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
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Wrapper */}
      <div className="w-full max-w-sm md:max-w-3xl lg:max-w-5xl">
        {/* Top Card */}
        <div className="relative bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white rounded-b-3xl p-6 md:p-10">
          <p className="text-yellow-400 text-sm md:text-base">Available Balance</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-1">$0 ≈ ₹0</h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white" />
            <span className="text-sm md:text-base">Increase Your Daily Income</span>
          </div>

          {/* Splash */}
          <div className="absolute -bottom-1 left-0 w-full">
            <svg viewBox="0 0 1440 120" className="w-full">
              <path
                fill="#ffffff"
                d="M0,80 C120,40 240,120 360,90 480,60 600,110 720,85 840,60 960,110 1080,90 1200,70 1320,90 1440,85 L1440,120 L0,120 Z"
              />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-8">
          {/* Deposit / Withdrawal */}
          <div className="bg-white mt-6 rounded-2xl shadow p-4 md:p-6 grid grid-cols-2 divide-x">
            <div className="flex items-center gap-3">
              <FiUpload className="text-green-500 text-xl md:text-2xl" />
              <div>
                <p className="text-gray-500 text-sm">Deposit</p>
                <p className="font-semibold">$0</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-4">
              <FiUpload className="text-red-500 text-xl md:text-2xl" />
              <div>
                <p className="text-gray-500 text-sm">Withdrawal</p>
                <p className="font-semibold">₹0</p>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="bg-white mt-4 rounded-2xl shadow p-4 md:p-6 grid grid-cols-2 divide-x">
            <div>
              <p className="text-gray-500 text-sm">Market Price</p>
              <p className="font-semibold">₹{loading ? '...' : marketPrice}</p>
            </div>
            <div className="pl-4">
              <p className="text-gray-500 text-sm">Our Price</p>
              <p className="font-semibold">₹{loading ? '...' : ourPrice}</p>
            </div>
          </div>

          {/* Live Rates */}
          <div className="mt-6">
            <p className="text-red-600 font-semibold mb-3">Live USDT Rates</p>

            <div className="grid md:grid-cols-2 gap-4">
              {loading ? (
                <p>Loading rates...</p>
              ) : liveRates.length > 0 ? (
                liveRates.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${item.bg || 'bg-gray-400'}`}>
                        {item.name ? item.name[0] : '?'}
                      </div>
                      <div>
                        <p className="font-semibold">{item.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400">USDT</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.price || 'N/A'}</p>
                      <p className={`text-xs ${item.color || 'text-gray-500'}`}>{item.change || 'N/A'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No live rates available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
