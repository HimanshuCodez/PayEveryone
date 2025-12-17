import { useState } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Password() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length !== 4 || confirmPassword.length !== 4) {
      toast.error("PIN must be 4 digits.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("PINs do not match.");
      return;
    }
    // Handle password submission logic here
    toast.success("Withdrawal password set successfully!");
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
            Withdraw Password Set
          </h2>
        </div>

        {/* Icon */}
        <div className="flex justify-center -mt-8">
          <div className="bg-white rounded-full p-4 shadow-md">
            <KeyRound size={32} className="text-blue-500" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 py-8 space-y-4">
          <FormInput
            id="password"
            label="Password [PIN]:"
            placeholder="Enter Withdrawal Password 4 Digit"
            type="password"
            maxLength="4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormInput
            id="confirmPassword"
            label="Re Enter [PIN]:"
            placeholder="Re Enter Withdrawal Password 4 Digit"
            type="password"
            maxLength="4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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
        className="w-full mt-1 p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
      />
    </div>
  );
}
