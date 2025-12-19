import { ArrowLeft, History } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import useAuthStore from "../store/authStore";
import { collection, addDoc, serverTimestamp, doc, runTransaction } from "firebase/firestore";
import { toast } from "react-toastify";

export default function UsdtWithdraw() {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState(0);

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      setBalance(user.balance || 0);
    }
  }, [user]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in to withdraw.");

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return toast.error("Please enter a valid amount.");
    }
    if (withdrawAmount > balance) {
      return toast.error("Insufficient balance.");
    }
    if (!address.trim()) {
      return toast.error("Please enter a USDT address.");
    }

    setSubmitting(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User document does not exist!");
        }

        const newBalance = (userDoc.data().balance || 0) - withdrawAmount;
        if (newBalance < 0) {
          throw new Error("Insufficient balance.");
        }

        // 1. Create withdrawal request
        const withdrawalRef = collection(db, "withdrawals");
        addDoc(withdrawalRef, {
          userId: user.uid,
          amount: withdrawAmount,
          address: address.trim(),
          method: 'USDT',
          status: 'pending',
          createdAt: serverTimestamp(),
        });
        
        // 2. Debit user's balance
        transaction.update(userRef, { balance: newBalance });
      });

      toast.success("Withdrawal request submitted successfully!");
      setAmount("");
      setAddress("");

    } catch (error) {
      console.error("Withdrawal error: ", error);
      toast.error(error.message || "Failed to submit withdrawal request.");
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
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Header */}

        <Link to="/Profile" className="absolute top-6 left-5">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ArrowLeft size={28} />
          </motion.div>
        </Link>

        <Link
          to="/History"
          className="absolute top-6 right-5 flex items-center gap-2 text-sm font-medium"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2"
          >
            <History size={20} />
            <span>History</span>
          </motion.div>
        </Link>

        {/* Balance Card - Now properly below the wave */}
        <div className="px-5 -mt-12 mb-6">
          {" "}
          {/* Increased -mt-12 to push it further down */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-2xl text-white text-center"
          >
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="text-4xl font-extrabold mt-2">$ {balance.toFixed(2)}</p>
          </motion.div>
        </div>

        {/* Form */}
        <form onSubmit={handleWithdraw} className="px-5 pb-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Amount (USDT)
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="amount"
              type="number"
              placeholder="Enter The Withdrawal Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-slate-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label
              htmlFor="usdt-address"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              USDT Address (TRC-20)
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="usdt-address"
              type="text"
              placeholder="Enter USDT TRC-20 Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-slate-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {submitting ? 'Processing...' : 'Withdraw'}
          </motion.button>
        </form>

        {/* FAQ */}
        <div className="px-5 pb-10 border-t border-slate-200 pt-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-xl font-bold text-gray-800 mb-4"
          >
            FAQ
          </motion.h3>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="space-y-3 text-sm text-gray-600"
          >
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-start gap-2"
            >
              <span className="text-orange-500 mt-1">•</span>
              <span>
                Minimum Withdrawal:{" "}
                <span className="font-semibold text-gray-800">200 USDT</span>
              </span>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
              className="flex items-start gap-2"
            >
              <span className="text-orange-500 mt-1">•</span>
              <span>
                Withdrawal Time: Monday to Sunday, 10:00 AM – 10:00 PM
              </span>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="flex items-start gap-2"
            >
              <span className="text-orange-500 mt-1">•</span>
              <span>
                Funds will arrive within{" "}
                <span className="font-semibold">24 hours</span>. If not
                received, please contact customer service.
              </span>
            </motion.li>
          </motion.ul>
        </div>
      </motion.div>
    </div>
  );
}
