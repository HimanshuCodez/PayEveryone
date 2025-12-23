import { ArrowLeft, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function TransHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const depositsQuery = query(
      collection(db, "depositRequests"),
      where("userId", "==", user.uid),
      where("status", "==", "approved")
    );

    const exchangesQuery = query(
      collection(db, "exchangeRequests"),
      where("userId", "==", user.uid),
      where("status", "==", "approved")
    );

    const unsubscribeDeposits = onSnapshot(depositsQuery, (snapshot) => {
      const deposits = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'credit' }));
      updateTransactions(deposits, 'credit');
    });

    const unsubscribeExchanges = onSnapshot(exchangesQuery, (snapshot) => {
      const exchanges = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'debit' }));
      updateTransactions(exchanges, 'debit');
    });
    
    // A helper to merge and sort transactions to avoid race conditions
    const updateTransactions = (newData, type) => {
        setTransactions(prev => {
            const otherTypeData = prev.filter(t => t.type !== type);
            const combined = [...otherTypeData, ...newData];
            return combined.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
        });
        setLoading(false);
    }

    return () => {
      unsubscribeDeposits();
      unsubscribeExchanges();
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative">
          <Link to="/Profile" className="absolute top-4 left-4">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-center text-xl font-semibold">Transaction History</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-80"><p>Loading history...</p></div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-gray-500">
            <FileText size={48} className="mb-4" />
            <p className="text-lg font-semibold">No Record Found</p>
          </div>
        ) : (
          <div className="py-4 px-2 space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                    {tx.type === 'credit' ? 
                        <TrendingUp className="text-green-500" /> : 
                        <TrendingDown className="text-red-500" />}
                    <div>
                        <p className="font-semibold capitalize">{tx.type}</p>
                        <p className="text-xs text-gray-500">{tx.createdAt?.toDate().toLocaleString()}</p>
                    </div>
                </div>
                <p className={`font-bold text-lg ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? `+$${tx.amount.toFixed(2)}` : `-₹${tx.amount.toFixed(2)}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}