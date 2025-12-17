import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-[#042346] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0a2d55] rounded-full p-1 flex">
            <button
              onClick={() => setIsSignIn(true)}
              className={`px-8 py-2 rounded-full font-semibold transition-colors ${
                isSignIn
                  ? "bg-blue-500 text-black"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`px-8 py-2 rounded-full font-semibold transition-colors ${
                !isSignIn
                  ? "bg-blue-500 text-black"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>
        {isSignIn ? <SignIn /> : <SignUp />}
      </div>
    </div>
  );
}
