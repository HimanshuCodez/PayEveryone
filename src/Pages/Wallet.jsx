
import { Copy } from "lucide-react";

export default function Deposit() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm md:max-w-md bg-white shadow-lg">

        {/* Header / QR Section */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-6 pb-10 relative">
          <div className="flex justify-center mb-4">
            <img
              src="/qr.png"
              alt="QR Code"
              className="w-44 h-44 bg-white p-2 rounded-xl"
            />
          </div>

          <p className="text-xs text-gray-300 mb-1">TRC-20 Wallet Address</p>
          <div className="flex items-center justify-between bg-slate-700 px-3 py-2 rounded-lg">
            <span className="text-xs truncate">
              TUJcD2754KcpUugRBw5hK4kThgzn3BACY
            </span>
            <button className="p-1">
              <Copy size={16} />
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

        {/* Form */}
        <div className="px-5 pt-6 pb-4">
          <p className="text-sm font-semibold mb-3">
            Minimum Deposit USDT : <span className="text-blue-600">$10</span>
          </p>

          <div className="mb-4">
            <label className="text-sm font-medium">Amount</label>
            <input
              type="number"
              placeholder="Enter Deposit Amount"
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium">Transaction ID</label>
            <input
              type="text"
              placeholder="Enter Transaction ID"
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl font-semibold">
            Submit
          </button>
        </div>

        {/* Status Card */}
        <div className="px-5 pb-24">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Deposit</span>
              <span className="text-red-500 text-xs">Reject</span>
            </div>

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Amount</span>
                <span>$108999</span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span>2025-12-14 17:55:33</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span className="truncate max-w-[140px]">IIFIFIFIFIDKROR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

