import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { doc, onSnapshot, collection, addDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthStore from '../store/authStore';
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Deposit() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [depositHistory, setDepositHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const { user } = useAuthStore();

  useEffect(() => {
    const docRef = doc(db, 'paymentMethods', 'usdtDeposit');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setQrCodeUrl(data.qrCodeUrl || '');
        setWalletAddress(data.walletAddress || '');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!user) {
      setHistoryLoading(false);
      return;
    }

    setHistoryLoading(true);
    const q = query(
      collection(db, 'depositRequests'),
      where('userId', '==', user.uid),
      // orderBy removed to avoid composite index requirement
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const history = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() });
      });
      
      // Client-side sorting
      history.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        return dateB - dateA; // Descending order
      });

      setDepositHistory(history);
      setHistoryLoading(false);
    }, (error) => {
      console.error("Error fetching deposit history: ", error);
      toast.error("Failed to load deposit history. The query may be invalid.");
      setHistoryLoading(false); // Ensure loading is turned off on query error
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
        name: user.name || 'Unknown User',
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
    <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm md:max-w-md bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Header / QR Section */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-14 relative"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            {loading ? (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-56 h-56 bg-white/90 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <p className="text-gray-600">Loading QR...</p>
              </motion.div>
            ) : qrCodeUrl ? (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 180 }}
                src={qrCodeUrl}
                alt="QR Code"
                className="w-56 h-56 bg-white p-3 rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="w-56 h-56 bg-white/90 rounded-2xl flex items-center justify-center shadow-2xl">
                <p className="text-gray-600 text-center px-4">QR Code not available</p>
              </div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-300 text-center mb-2"
          >
            TRC-20 Wallet Address
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between bg-slate-700/80 backdrop-blur px-4 py-3 rounded-xl shadow-inner"
          >
            <span className="text-sm truncate pr-2">
              {loading ? 'Loading...' : (walletAddress || 'No address set')}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              disabled={!walletAddress || loading}
              className="p-2 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 transition"
            >
              <Copy size={18} />
            </motion.button>
          </motion.div>

          {/* Animated Wave */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pt-6 pb-6 -mt-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm font-semibold mb-5 text-center"
          >
            Minimum Deposit USDT : <span className="text-blue-600 text-lg">$10</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-5"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              placeholder="Enter Deposit Amount (USDT)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-8"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Paste Transaction Hash"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {submitting ? 'Submitting...' : 'Submit Deposit Request'}
          </motion.button>
        </form>

        {/* Deposit History */}
        <div className="px-5 pb-10">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-xl font-bold text-gray-800 mb-5 border-b-2 border-slate-200 pb-3"
          >
            Deposit History
          </motion.h3>

          {historyLoading ? (
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center text-gray-500 py-8"
            >
              Loading history...
            </motion.p>
          ) : depositHistory.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              {depositHistory.map((deposit, i) => (
                <motion.div
                  key={deposit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <DepositStatusCard deposit={deposit} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 py-10">No deposit history found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DepositStatusCard({ deposit }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-amber-600 bg-amber-100';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-2xl p-5 shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium">
          Deposit
        </span>
        <span className={`text-sm font-bold uppercase px-4 py-2 rounded-full ${getStatusClass(deposit.status)}`}>
          {deposit.status || 'pending'}
        </span>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount</span>
          <span className="font-bold text-lg">${deposit.amount?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Time</span>
          <span className="text-gray-800">
            {deposit.createdAt?.toDate()?.toLocaleString() || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Transaction ID</span>
          <span className="truncate max-w-[160px] text-gray-800 font-mono text-xs">
            {deposit.transactionId}
          </span>
        </div>
      </div>
    </motion.div>
  );
}