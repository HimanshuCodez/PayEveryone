
import { IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

export default function Exchange() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm md:max-w-md bg-white shadow-lg">

        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-8 ring-slate-700">
              <IndianRupee className="text-white" size={28} />
            </div>
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

        {/* Content */}
        <div className="px-5 pt-6 pb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium">Available : ₹ 0</p>
            <button className="text-blue-600 text-sm font-semibold">History</button>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="text-sm font-medium">Amount (INR)</label>
            <div className="flex mt-1">
              <input
                type="number"
                placeholder="Minimum Amount : ₹10,000"
                className="w-full px-3 py-2 border rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 border rounded-r-lg bg-gray-100 text-gray-500 text-sm">--</button>
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="text-sm font-medium">Withdraw Password</label>
            <input
              type="password"
              placeholder="Enter Your Withdraw Password"
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add Bank */}
        <Link to="/bank"><button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2.5 rounded-xl font-semibold">
            Click Here To Add New Bank Account
          </button></Link>
        </div>
      </div>
    </div>
  );
}
