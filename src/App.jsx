import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import Home from "./Pages/Home";
import useAuthStore from "./store/authStore";
import Deposit from "./Pages/Wallet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./Admin/Admin";
import AdminRoute from "./Admin/AdminRoute";
import Spinner from "./components/Loader";
import ReferralScreen from "./components/Refer";
import Profile from "./Pages/Profile";
import Support from "./Pages/Support";
import PrivacyPolicy from "./components/PrivacyPolicy";
import BottomNav from "./components/BottomNav";
import Exchange from "./Pages/Exchange";
import Navbar from "./components/Navbar";
import UserProfile from "./Pages/UserProfile";
import Ranking from "./Pages/Ranking";
import TransHistory from "./Pages/TransHistory";
import UsdtWithdraw from "./Pages/UsdtWithdraw";
import Bank from "./Pages/Bank";
import Password from "./Pages/Password";
import Help from "./Pages/Help";
import Auth from "./Pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const showNav = location.pathname !== "/Admin" && location.pathname !== "/auth";

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/Admin");
    }
  }, [user, navigate]);

  return (
    <>
      {showNav && <div className="mb-16"><Navbar /> </div> }
      <main className="">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UserProfile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Ranking"
            element={
              <ProtectedRoute>
                <Ranking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/History"
            element={
              <ProtectedRoute>
                <TransHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Withdraw"
            element={
              <ProtectedRoute>
                <UsdtWithdraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Exchange"
            element={
              <ProtectedRoute>
                <Exchange />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Deposit"
            element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Privacy"
            element={
              <ProtectedRoute>
                <PrivacyPolicy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Reffer"
            element={
              <ProtectedRoute>
                <ReferralScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bank"
            element={
              <ProtectedRoute>
                <Bank />
              </ProtectedRoute>
            }
          />
          <Route
            path="/password"
            element={
              <ProtectedRoute>
                <Password />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      {showNav && <BottomNav />}
      <ToastContainer />
    </>
  );
};

const App = () => {
  const { setUser } = useAuthStore();
  const auth = getAuth();
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let unsubscribeUser = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
      // Unsubscribe from the previous user's snapshot listener
      unsubscribeUser();

      if (userAuth) {
        const userRef = doc(db, "users", userAuth.uid);
        unsubscribeUser = onSnapshot(userRef, (userSnap) => {
          if (userSnap.exists()) {
            setUser({ ...userAuth, ...userSnap.data() });
          } else {
            setUser(userAuth);
          }
          setLoadingAuth(false);
        }, (error) => {
          console.error("Snapshot listener error:", error);
          // Handle the error appropriately
          setUser(null);
          setLoadingAuth(false);
        });
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUser();
    };
  }, [auth, setUser]);

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#042346] text-white flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <AppContent />;
};

export default App;