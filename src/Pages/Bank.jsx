import { useState } from "react";
import { ArrowLeft, Banknote, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Bank() {
  const [method, setMethod] = useState("bank"); // 'bank' or 'upi'
  const [bankName, setBankName] = useState("");
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");

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
          ) : (
            <FormInput
              id="upiId"
              label="UPI ID:"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
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
