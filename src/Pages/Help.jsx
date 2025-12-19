import { ArrowLeft, LifeBuoy } from "lucide-react";
import { Link } from "react-router-dom";

export default function Help() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative">
          <Link to="/Profile" className="absolute top-4 left-4">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-center text-xl font-semibold">Help</h2>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-4 text-sm text-gray-700">
          <p>
            1. New User Don't Trust The USDT Deposit Address Sent To You By
            Anyone, Please Get The Real Deposit Address In The App.
          </p>
          <p>
            2. Do Not Share Your Passwords With Anyone, Even If They Claim To Be
            From The PayEveryone Team.
          </p>
          <p>
            3. PayEveryone Customer Support Is Only Available Through Our Official
            Customer Support In The App.
          </p>
          <p>
            4. We Will Never Send You A Private Message Or Contact You Directly
            Asking For Your Password For Any Reason.
          </p>
          <p>
            5. If You Ever Receive A Suspicious Message Or Phone Call That Seems
            Unusual Or Asks For Personal Information, Please Do Not Respond To
            It. Instead, Contact Our Customer Service Team Right Away. Our Team
            Is Available 24/7 To Assist You With Any Concerns.
          </p>
          <p>
            6. If Your Withdrawal Taking Above 1 Hour, Contact Our Customer
            Support.
          </p>
        </div>

        {/* Customer Support */}
        <div className="px-4 pb-6">
          <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
            <LifeBuoy size={20} />
            Customer Support
          </button>
        </div>
      </div>
    </div>
  );
}
