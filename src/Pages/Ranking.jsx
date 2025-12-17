import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

const rankingData = [
  { rank: 1, user: "Rav***", amount: "₹3,34,500" },
  { rank: 2, user: "Anj***", amount: "₹2,85,000" },
  { rank: 3, user: "Vik***", amount: "₹2,50,500" },
  { rank: 4, user: "Pri***", amount: "₹2,10,800" },
  { rank: 5, user: "Sur***", amount: "₹1,75,300" },
  { rank: 6, user: "Neh***", amount: "₹1,42,700" },
];

export default function Ranking() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative">
          <Link to="/Profile" className="absolute top-4 left-4">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-center text-xl font-semibold">Ranking</h2>
        </div>

        {/* User's Rank */}
        <div className="px-4 py-4">
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center shadow-lg">
            <p className="font-semibold text-lg">{user?.fullName || user?.email || "User"}</p>
            <p className="text-sm">Your Rank : 99+</p>
            <p className="font-bold text-2xl mt-1">0 INR</p>
          </div>
        </div>

        {/* Ranking List */}
        <div className="px-4 py-2 space-y-2">
          <h3 className="font-semibold text-gray-800 mb-2">Ranking Section</h3>
          {rankingData.map((item) => (
            <RankingItem
              key={item.rank}
              rank={item.rank}
              user={item.user}
              amount={item.amount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RankingItem({ rank, user, amount }) {
  return (
    <div className="flex items-center justify-between bg-slate-100 px-4 py-3 rounded-lg">
      <div className="flex items-center gap-3">
        <span
          className={`font-bold text-lg ${
            rank <= 3 ? "text-yellow-500" : "text-gray-500"
          }`}
        >
          {rank}
        </span>
        <span className="font-semibold text-gray-800">User {user}</span>
      </div>
      <span className="font-semibold text-green-600">{amount}</span>
    </div>
  );
}
