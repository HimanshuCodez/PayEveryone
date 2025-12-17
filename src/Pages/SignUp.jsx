import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, query, collection, where, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { Eye, EyeOff } from 'lucide-react'; // Import Eye icons

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const generateReferralCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) { // Generate a 6-character code
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleSignUp = async () => {
    if (!fullName) return toast.error("Enter your full name");
    if (!email) return toast.error("Enter your email");
    if (!password) return toast.error("Enter your password");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed up:", user);

      const newReferralCode = generateReferralCode();
      const userDocRef = doc(db, "users", user.uid);

      let referrerId = null;
      let bonusAmount = 0;
      if (referralCodeInput) {
        const referrerQuery = query(collection(db, "users"), where("referralCode", "==", referralCodeInput));
        const referrerSnapshot = await getDocs(referrerQuery);

        if (!referrerSnapshot.empty) {
          const referrerDoc = referrerSnapshot.docs[0];
          referrerId = referrerDoc.id;
          bonusAmount = 50;
          toast.success(`Referral code applied! You received ₹${bonusAmount} bonus.`);
        } else {
          toast.warn("Invalid referral code. No bonus applied.");
        }
      }

      await setDoc(userDocRef, {
        fullName: fullName,
        email: email,
        role: 'user',
        referralCode: newReferralCode,
        referredBy: referrerId,
        balance: bonusAmount,
        winningMoney: 0,
        createdAt: new Date(),
      }, { merge: true });

      if (bonusAmount > 0) {
        await addDoc(collection(db, "transactions"), {
          userId: user.uid,
          type: "referral_bonus",
          amount: bonusAmount,
          description: `Referral bonus from ${referralCodeInput}`,
          createdAt: new Date(),
        });
      }

      toast.success("Sign up successful!");
      navigate("/");
    } catch (err) {
      console.error("Sign up error:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#042346] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-[#0a2d55] p-6 md:p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h1 className="font-bold text-3xl mb-2">
            Pay<span className="text-blue-500">Everyone</span>
          </h1>
          <p className="text-gray-300">
            Create your account
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Your Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-[#042346] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#042346] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative w-full"> {/* Wrapper div for relative positioning */}
            <input
              type={showPassword ? "text" : "password"} // Dynamic type
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#042346] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Add padding-right
            />
            <button
              type="button" // Important to prevent form submission
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <input
            type="text"
            placeholder="Referral Code (Optional)"
            value={referralCodeInput}
            onChange={(e) => setReferralCodeInput(e.target.value)}
            className="w-full px-4 py-3 bg-[#042346] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-blue-500 text-black font-bold px-5 py-3 rounded-full hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-400"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;