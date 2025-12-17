import React, { useEffect, useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Trophy, 
  DollarSign, 
  QrCode, 
  Check, 
  X, 
  Eye,
  Edit,
  Plus,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, doc, runTransaction, getDocs, where, deleteDoc } from 'firebase/firestore';
import useAuthStore from '../store/authStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import WithdrawApproval from './components/WithdrawApproval';
import DashboardView from './components/DashboardView';
import AllUsers from './components/AllUsers';
import HarufUpdate from './components/HarufUpdate';
import Bets from './components/Bets'; // Import the new component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0); // Kept for UI, but will show 0.
  const [userDetails, setUserDetails] = useState({});

  const { user, setUser } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!isAdmin) return;

    const paymentsQuery = query(collection(db, 'top-ups'));
    const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
      const fetchedPayments = snapshot.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().createdAt ? new Date(d.data().createdAt).toLocaleDateString() : 'N/A', user: d.data().userId }));
      setPayments(fetchedPayments);
      const userIds = [...new Set(fetchedPayments.map(p => p.userId))];
      fetchMissingUserDetails(userIds);
    });

    const withdrawalsQuery = query(collection(db, 'withdrawals'));
    const unsubscribeWithdrawals = onSnapshot(withdrawalsQuery, (snapshot) => {
      const fetchedWithdrawals = snapshot.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().createdAt ? new Date(d.data().createdAt).toLocaleDateString() : 'N/A', user: d.data().userId }));
      setWithdrawals(fetchedWithdrawals);
      const userIds = [...new Set(fetchedWithdrawals.map(w => w.userId))];
      fetchMissingUserDetails(userIds);
    });

    const usersQuery = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      setTotalUsers(snapshot.size);
    });

    return () => {
      unsubscribePayments();
      unsubscribeWithdrawals();
      unsubscribeUsers();
    };
  }, [isAdmin]);

  const fetchMissingUserDetails = (userIds) => {
    userIds.forEach(async (userId) => {
      if (!userDetails[userId]) {
        const userQuery = query(collection(db, 'users'), where('uid', '==', userId));
        const userSnap = await getDocs(userQuery);
        if (!userSnap.empty) {
          setUserDetails(prev => ({ ...prev, [userId]: userSnap.docs[0].data() }));
        }
      }
    });
  };

  // --- ACTION HANDLERS ---

  const handleWithdrawalApproval = async (withdrawalId, action, userId, amount) => {
    try {
      await runTransaction(db, async (transaction) => {
        const withdrawalRef = doc(db, 'withdrawals', withdrawalId);
        transaction.update(withdrawalRef, { status: action });

        if (action === 'rejected') {
          const userRef = doc(db, 'users', userId);
          const userSnap = await transaction.get(userRef);
          if (userSnap.exists()) {
            const currentWinningMoney = userSnap.data().winningMoney || 0;
            transaction.update(userRef, { winningMoney: currentWinningMoney + amount });
          }
        }
      });
      toast.success(`Withdrawal ${action} successfully!`);
    } catch (error) {
      console.error(`Error ${action} withdrawal:`, error);
      toast.error(`Failed to ${action} withdrawal.`);
    }
  };
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null); // Clear user from Zustand store
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    }
  };

  // --- CHILD COMPONENTS ---
  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64`}>
      <div className="mb-8 flex justify-center items-center">
        <div>
          <h1 className="text-2xl font-bold text-center">SattaKing</h1>
          <p className="text-gray-400 text-center text-sm">Admin Dashboard</p>
        </div>
      </div>
      <nav className="space-y-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Settings },
          { id: 'allUsers', label: 'All Users', icon: Users },
          { id: 'bets', label: 'Betting History', icon: Trophy },
          { id: 'withdrawals', label: 'Withdrawal Approval', icon: DollarSign },
          { id: 'harufUpdate', label: 'Market Results', icon: Edit },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-red-400"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );

  const Header = () => (
    <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2">
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <h2 className="text-2xl font-semibold capitalize">{activeTab.replace('allUsers', 'All Users').replace('harufUpdate', 'Market Results')}</h2>
      </div>
    </div>
  );

  const renderContent = () => {
    const stats = {
        totalUsers: totalUsers,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length
    };

    switch (activeTab) {
      case 'dashboard': 
        return <DashboardView stats={stats} />;
      case 'allUsers':
        return <AllUsers />;
      case 'bets':
        return <Bets />;
      case 'withdrawals': 
        return <WithdrawApproval 
                  withdrawals={withdrawals}
                  userDetails={userDetails}
                  handleWithdrawalApproval={handleWithdrawalApproval}
                />;
      case 'harufUpdate':
        return <HarufUpdate />;
      default: 
        return <DashboardView stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;