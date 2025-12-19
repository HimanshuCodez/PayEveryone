import { useState, useEffect } from "react";
import { ArrowLeft, Banknote, Landmark, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from "framer-motion";

export default function Bank() {
  const [method, setMethod] = useState("bank"); // 'bank', 'upi', or 'qr'
  const [bankName, setBankName] = useState("");
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loadingQr, setLoadingQr] = useState(true);

  useEffect(() => {
    if (method === 'qr') {
      const docRef = doc(db, 'paymentMethods', 'qrCode');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setQrCodeUrl(docSnap.data().url);
        } else {
          setQrCodeUrl('');
        }
        setLoadingQr(false);
      });
      return () => unsubscribe();
    }
  }, [method]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (method === "upi") {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(upiId)) {
        toast.error("Please enter a valid UPI ID.");
        return;
      }
    }
    toast.success("Details submitted successfully!");
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
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative"
        >
          <Link to="/Profile" className="absolute top-4 left-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ArrowLeft size={24} />
            </motion.div>
          </Link>
          <h2 className="text-center text-xl font-semibold">
            Add New Bank Account
          </h2>
        </motion.div>

        {/* Toggle */}
        <div className="px-4 pt-4 pb-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="flex rounded-full bg-slate-200 p-1 shadow-inner">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMethod("bank")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  method === "bank"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-gray-600"
                }`}
              >
                <Landmark size={18} />
                Bank
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMethod("upi")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  method === "upi"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-gray-600"
                }`}
              >
                <Banknote size={18} />
                UPI
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setMethod("qr");
                  setLoadingQr(true);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  method === "qr"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-gray-600"
                }`}
              >
                <QrCode size={18} />
                QR Code
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-8">
          <motion.div
            key={method}
            initial={{ opacity: 0, x: method === "bank" ? -20 : method === "upi" ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: method === "bank" ? 20 : method === "upi" ? 0 : -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {method === "bank" ? (
              <>
                <FormInput label="Bank Name:" placeholder="Enter Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                <FormInput label="Ac Holder Name:" placeholder="Enter Bank Ac Holder Name" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
                <FormInput label="Account Number:" placeholder="Enter Account Number" type="number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                <FormInput label="Bank IFSC Code:" placeholder="Enter IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
              </>
            ) : method === "upi" ? (
              <FormInput label="UPI ID:" placeholder="example@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl shadow-inner"
              >
                <p className="text-lg font-semibold text-gray-800 mb-6">Scan to Pay</p>
                {loadingQr ? (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center"
                  >
                    <p className="text-gray-500">Loading QR...</p>
                  </motion.div>
                ) : qrCodeUrl ? (
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-64 h-64 border-4 border-white shadow-2xl rounded-2xl object-contain"
                  />
                ) : (
                  <p className="text-gray-500">QR Code not available.</p>
                )}
                <p className="text-sm text-gray-500 mt-5 text-center">
                  Please use a UPI app to scan this code.
                </p>
              </motion.div>
            )}
          </motion.div>

          {method !== "qr" && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full mt-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
            >
              Submit
            </motion.button>
          )}
        </form>
      </motion.div>
    </div>
  );
}

function FormInput({ label, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <motion.input
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
        className="w-full p-4 border border-gray-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
      />
    </motion.div>
  );
}