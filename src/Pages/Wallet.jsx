import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { doc, onSnapshot, collection, addDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthStore from '../store/authStore';
import { toast } from "react-toastify";

export default function Deposit() {
  // State for data fetched from backend
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for the form
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // State for user's deposit history
  const [depositHistory, setDepositHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const { user } = useAuthStore();

  // Effect for fetching deposit info (QR, Address)
  useEffect(() => {
    const docRef = doc(db, 'paymentMethods', 'usdtDeposit');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setQrCodeUrl(data.qrCodeUrl || '');
        setWalletAddress(data.walletAddress || '');
      } else {
        console.log("No such document for USDT deposit!");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // Effect for fetching user's deposit history
  useEffect(() => {
    if (!user) {
      setHistoryLoading(false);
      return;
    };

    setHistoryLoading(true);
    const q = query(
      collection(db, 'depositRequests'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const history = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() });
      });
      setDepositHistory(history);
      setHistoryLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success("Address copied to clipboard!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to make a deposit.");
      return;
    }
    if (!amount || !transactionId) {
      toast.error("Please fill in both amount and transaction ID.");
      return;
    }
    if (parseFloat(amount) < 10) {
      toast.error("Minimum deposit is $10.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'depositRequests'), {
        userId: user.uid,
        displayName: user.displayName || 'Unknown User',
        amount: parseFloat(amount),
        transactionId,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast.success("Deposit request submitted successfully!");
      setAmount('');
      setTransactionId('');
    } catch (error) {
      console.error("Error submitting deposit request: ", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm md:max-w-md bg-white shadow-lg">

        {/* Header / QR Section */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-6 pb-10 relative">
          {/* ... QR and Address rendering ... */}
          <div className="flex justify-center mb-4">
            {loading ? (
              <div className="w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Loading QR...</p>
              </div>
            ) : qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="w-44 h-44 bg-white p-2 rounded-xl"/>
            ) : (
              <div className="w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center">
                <p className="text-gray-500 text-center">QR Code not available</p>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-300 mb-1">TRC-20 Wallet Address</p>
          <div className="flex items-center justify-between bg-slate-700 px-3 py-2 rounded-lg">
            <span className="text-xs truncate">{loading ? 'Loading...' : (walletAddress || 'No address set')}</span>
            <button onClick={handleCopy} className="p-1" disabled={!walletAddress}><Copy size={16} /></button>
          </div>
          <div className="absolute bottom-0 left-0 w-full"><svg viewBox="0 0 1440 120" className="w-full"><path fill="#ffffff" d="M0,80L60,74.7C120,69,240,59,360,48C480,37,600,27,720,37.3C840,48,960,80,1080,85.3C1200,91,1320,69,1380,58.7L1440,48L1440,120L0,120Z"/></svg></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pt-6 pb-4">
          <p className="text-sm font-semibold mb-3">
            Minimum Deposit USDT : <span className="text-blue-600">$10</span>
          </p>
          <div className="mb-4">
            <label className="text-sm font-medium">Amount</label>
            <input
              type="number"
              placeholder="Enter Deposit Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="text-sm font-medium">Transaction ID</label>
            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl font-semibold disabled:bg-gray-400">
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Status Section */}
        <div className="px-5 pb-24 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Deposit History</h3>
            {historyLoading ? (
                <p>Loading history...</p>
            ) : depositHistory.length > 0 ? (
                depositHistory.map(deposit => <DepositStatusCard key={deposit.id} deposit={deposit} />)
            ) : (
                <p className="text-center text-gray-500 py-4">No deposit history found.</p>
            )}
        </div>
      </div>
    </div>
  );
}

// A new component for displaying the status of a single deposit
function DepositStatusCard({ deposit }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'approved': return 'text-green-500';
            case 'rejected': return 'text-red-500';
            default: return 'text-yellow-500';
        }
    };

    return (
        <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between mb-2">
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">Deposit</span>
                <span className={`text-xs font-semibold uppercase ${getStatusClass(deposit.status)}`}>
                    {deposit.status}
                </span>
            </div>
            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span>Amount</span>
                    <span>${deposit.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Time</span>
                    <span>{deposit.createdAt?.toDate().toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="truncate max-w-[140px]">{deposit.transactionId}</span>
                </div>
            </div>
        </div>
    );
}

