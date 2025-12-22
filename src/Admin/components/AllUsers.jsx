import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Loader from '../../components/Loader';
import UserBettingHistory from './UserBettingHistory';


const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, 'users'), orderBy('name'));
        const querySnapshot = await getDocs(usersQuery);
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (err) {
        setError('Failed to fetch users. Please check console for details.');
        console.error("Error fetching users: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return users.filter(user =>
      user.fullName?.toLowerCase().includes(lowercasedFilter) ||
      user.email?.toLowerCase().includes(lowercasedFilter) ||
      user.phoneNumber?.includes(lowercasedFilter)
    );
  }, [searchTerm, users]);

  const formatJoinDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    const joinDate = timestamp.toDate();
    const today = new Date();

    const isToday = joinDate.getDate() === today.getDate() &&
                    joinDate.getMonth() === today.getMonth() &&
                    joinDate.getFullYear() === today.getFullYear();

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = joinDate.toLocaleDateString(undefined, options);

    return (
      <span className={isToday ? 'text-green-600 font-medium' : 'text-gray-600'}>
        {isToday ? 'New User ' : 'Old User '} ({formattedDate})
      </span>
    );
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setNewBalance(user.balance || '0');
  };

  const handleUpdateBalance = async () => {
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', editingUser.id);
      const amountToAdd = parseFloat(newBalance);

      if (isNaN(amountToAdd) || amountToAdd <= 0) {
        console.error("Invalid amount value");
        setError("Invalid amount value. Please enter a valid positive number.");
        setIsUpdating(false);
        return;
      }
      
      const currentBalance = editingUser.balance || 0;
      const newBalanceValue = currentBalance + amountToAdd;


      await updateDoc(userRef, {
        balance: newBalanceValue,
      });
      
      await addDoc(collection(db, 'transactions'), {
        userId: editingUser.id,
        amount: amountToAdd,
        type: 'admin_credit',
        status: 'approved',
        createdAt: new Date(),
      });


      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === editingUser.id ? { ...u, balance: newBalanceValue } : u
        )
      );
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update balance. Please check console for details.');
      console.error("Error updating balance: ", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8"><Loader /></div>;
  }

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users ({filteredUsers.length})</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by fullName, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
            
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Joined Date</th>
              <th className="p-4 text-right text-sm font-semibold text-gray-600">Usdt Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const totalBalance = (user.balance || 0) + (user.winningMoney || 0);
              return (
                <tr key={user.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleUserClick(user)}>
                    {user.name || 'N/A'}
                  </td>
             
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center justify-between">
                      {user.email || 'N/A'}
                    
                    </div>
                  </td>
                  <td className="p-4 text-left text-gray-600">{formatJoinDate(user.createdAt)}</td>
                  <td className="p-4 text-right font-semibold text-gray-800">
                    <div className="flex items-center justify-end gap-2">
                      <span>₹{totalBalance.toFixed(2)}</span>
                      <button onClick={() => handleEditClick(user)} className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Wallet for {editingUser.name}</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:text-gray-800 font-bold text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Balance: <span className='font-bold'>₹{editingUser.balance?.toFixed(2) || '0.00'}</span>
                </label>
                <label htmlFor="new-balance" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Add
                </label>
                <input
                  type="number"
                  id="new-balance"
                  placeholder="Enter amount to add"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBalance}
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
