import { ArrowLeft, History } from "lucide-react";
import { Link } from "react-router-dom";

export default function UsdtWithdraw() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative">
          <Link to="/Profile" className="absolute top-4 left-4">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-center text-xl font-semibold">Withdraw [USDT]</h2>
          <Link
            to="/History"
            className="absolute top-4 right-4 flex items-center gap-1 text-sm"
          >
            <History size={16} />
            <span>History</span>
          </Link>
        </div>

        {/* Balance */}
        <div className="px-4 -mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-sm">Available Balance</p>
            <p className="font-bold text-2xl mt-1">$ 0</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-4 py-4 space-y-4">
          <div>
            <label htmlFor="amount" className="text-sm font-semibold text-gray-700">
              Amount:
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Enter The Withdrawal Amount"
              className="w-full mt-1 p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="usdt-address"
              className="text-sm font-semibold text-gray-700"
            >
              USDT Address:
            </label>
            <input
              id="usdt-address"
              type="text"
              placeholder="Enter USDT TRC-20 Address"
              className="w-full mt-1 p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold">
            Withdraw
          </button>
        </div>

        {/* FAQ */}
        <div className="px-4 py-4 border-t">
          <h3 className="font-semibold text-gray-800 mb-2">FAQ:</h3>
          <ul className="space-y-2 text-xs text-gray-600 list-disc list-inside">
            <li>Minimum Withdrawal : 200</li>
            <li>The Withdrawal Time Is From Monday To Sunday From 10Am to 10Pm</li>
            <li>
              After You Submit The Withdrawal Application, Your Fund Will Arrive
              In Your Account Within 24 Hours. If You Have not Recive The
              payment Within The time limit, Please Contact Customer Service For
              Assistance In Time.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
