import { useState, useEffect } from "react";
import { ArrowLeft, Banknote, Landmark, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

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
      // Cleanup listener on component unmount or when method changes
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
    // Handle form submission logic here
    toast.success("Details submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative">
          <Link to="/Profile" className="absolute top-4 left-4">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-center text-xl font-semibold">
            Add New Bank Account
          </h2>
        </div>

        {/* Toggle */}
        <div className="p-4 flex justify-center">
          <div className="flex rounded-full bg-slate-200 p-1">
            <button
              onClick={() => setMethod("bank")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold ${
                method === "bank"
                  ? "bg-white text-slate-900 shadow"
                  : "text-gray-600"
              }`}
            >
              <Landmark size={16} />
              Bank
            </button>
            <button
              onClick={() => setMethod("upi")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold ${
                method === "upi"
                  ? "bg-white text-slate-900 shadow"
                  : "text-gray-600"
              }`}
            >
              <Banknote size={16} />
              UPI
            </button>
            <button
              onClick={() => {
                setMethod("qr");
                setLoadingQr(true); // Reset loading state when switching to QR
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold ${
                method === "qr"
                  ? "bg-white text-slate-900 shadow"
                  : "text-gray-600"
              }`}
            >
              <QrCode size={16} />
              QR Code
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4">
          {method === "bank" ? (
            <>
              <FormInput
                id="bankName"
                label="Bank Name:"
                placeholder="Enter Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <FormInput
                id="holderName"
                label="Ac Holder Name:"
                placeholder="Enter Bank Ac Holder Name"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
              />
              <FormInput
                id="accountNumber"
                label="Account Number:"
                placeholder="Enter Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                type="number"
              />
              <FormInput
                id="ifscCode"
                label="Bank Ifsc Code:"
                placeholder="Enter Ifsc Code"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
              />
            </>
          ) : method === "upi" ? (
            <FormInput
              id="upiId"
              label="UPI ID:"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          ) : (
            // QR Code section
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-inner mt-4">
              <p className="text-lg font-semibold text-gray-800 mb-4">Scan to Pay</p>
              {loadingQr ? (
                <p>Loading QR Code...</p>
              ) : qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48 border border-gray-300 rounded-lg object-contain"
                />
              ) : (
                <p>QR Code not available.</p>
              )}
              <p className="text-sm text-gray-500 mt-3">Please use a UPI app to scan this code.</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function FormInput({ id, label, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full mt-1 p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
