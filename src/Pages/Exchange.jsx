import { IndianRupee, Landmark, Banknote, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { doc, onSnapshot, addDoc, collection, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

export default function Exchange() {
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [ourPrice, setOurPrice] = useState("0");
  const [loading, setLoading] =useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const [userWithdrawPassword, setUserWithdrawPassword] = useState("");
  const [bankDetails, setBankDetails] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [userQrCodeUrl, setUserQrCodeUrl] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exchangeRequests, setExchangeRequests] = useState([]);

  const { user } = useAuthStore();

  useEffect(() => {
    const docRef = doc(db, "marketData", "prices");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOurPrice(data.ourPrice || "N/A");
      } else {
        console.log("No such document!");
        setOurPrice("Error");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserBalance(0);
      setExchangeRequests([]);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeUser = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserBalance(userData.balance || 0);
          setUserWithdrawPassword(userData.withdrawPassword || "");
          setBankDetails(userData.bankDetails || null);
          setUpiId(userData.upiId || "");
          setUserQrCodeUrl(userData.userQrCodeUrl || "");
        } else {
          console.log("User document not found for UID:", user.uid);
          setUserBalance(0);
        }
      },
      (error) => {
        console.error("Error fetching user data for Exchange page:", error);
        setUserBalance(0);
      }
    );

    const q = query(collection(db, "exchangeRequests"), where("userId", "==", user.uid));
    const unsubscribeRequests = onSnapshot(q, (querySnapshot) => {
        const requests = [];
        querySnapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() });
        });
        setExchangeRequests(requests.sort((a,b) => b.createdAt - a.createdAt));
    });

    return () => {
        unsubscribeUser();
        unsubscribeRequests();
    };
  }, [user]);

  const convertedBalanceInINR = userBalance * parseFloat(ourPrice);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount.");
      }
      if (parseFloat(amount) > convertedBalanceInINR) {
        throw new Error("Insufficient balance.");
      }
      if (!password) {
        throw new Error("Please enter your withdrawal password.");
      }
      if (password !== userWithdrawPassword) {
        throw new Error("Withdrawal password does not match.");
      }
      if (!selectedPaymentMethod) {
        throw new Error("Please select a payment method.");
      }

      await addDoc(collection(db, "exchangeRequests"), {
        userId: user.uid,
        amount: parseFloat(amount),
        paymentMethod: selectedPaymentMethod,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Withdrawal request submitted successfully!");
      setAmount("");
      setPassword("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PaymentMethodCard = ({ type, details, Icon }) => {
    const isSelected = selectedPaymentMethod && selectedPaymentMethod.type === type;
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={() => setSelectedPaymentMethod({ type, details })}
        className={`p-4 border rounded-lg cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : ''}`}
      >
        <div className="flex items-center gap-4">
          <Icon className="text-blue-500" />
          <div className="text-sm">
            {type === 'Bank' && (
              <>
                <p className="font-bold">{details.bankName}</p>
                <p>{details.accountNumber}</p>
              </>
            )}
            {type === 'UPI' && <p className="font-bold">{details}</p>}
            {type === 'QR' && <img src={details} alt="QR Code" className="w-16 h-16" />}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm md:max-w-md bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-12 relative">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-8 ring-slate-700">
              <IndianRupee className="text-white" size={28} />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold mt-4">Exchange Wallet</h1>
        </div>

        <div className="px-5 pt-6 pb-8 -mt-6 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm font-medium text-gray-700">
              Available :{" "}
              <span className="font-bold text-lg">
                ₹ {loading || isNaN(convertedBalanceInINR) ? "..." : convertedBalanceInINR.toFixed(2)}
              </span>
            </p>
            <Link to="/History" className="text-blue-600 text-sm font-semibold hover:underline">
              History
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700">Amount (INR)</label>
              <div className="flex mt-1 shadow-sm">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min: ₹100, Max: ₹${convertedBalanceInINR.toFixed(2)}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-l-xl text-sm focus:outline-none"
                />
              </div>
            </div>
            
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700">Select Payment Method</label>
              <div className="space-y-2 mt-1">
                {bankDetails && <PaymentMethodCard type="Bank" details={bankDetails} Icon={Landmark} />}
                {upiId && <PaymentMethodCard type="UPI" details={upiId} Icon={Banknote} />}
                {userQrCodeUrl && <PaymentMethodCard type="QR" details={userQrCodeUrl} Icon={QrCode} />}
                 {!bankDetails && !upiId && !userQrCodeUrl && (
                  <Link to="/bank" className="text-blue-500 hover:underline text-sm">
                    + Add a payment method
                  </Link>
                )}
              </div>
            </div>

            {selectedPaymentMethod && (
              <>
                <div className="mb-8">
                  <label className="text-sm font-medium text-gray-700">Withdraw Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Withdraw Password"
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3.5 rounded-xl font-semibold text-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </motion.div>
              </>
            )}
            {!selectedPaymentMethod && (
               <Link to="/bank">
              <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300">
                Click Here To Add New Bank Account
              </button>
            </Link>
            )}
          </form>
        </div>

        <div className="px-5 pb-8">
            <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">Recent Exchange Requests</h3>
            <div className="space-y-3">
                {exchangeRequests.length > 0 ? exchangeRequests.map(req => (
                    <div key={req.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold">₹{req.amount.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">{new Date(req.createdAt?.toDate()).toLocaleString()}</p>
                        </div>
                        <p className={`font-bold text-sm uppercase ${
                            req.status === 'approved' ? 'text-green-500' :
                            req.status === 'rejected' ? 'text-red-500' :
                            'text-yellow-500'
                        }`}>{req.status}</p>
                    </div>
                )) : <p className="text-sm text-gray-500 text-center">No recent requests.</p>}
            </div>
        </div>
      </motion.div>
    </div>
  );
}
