import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, query, where, onSnapshot, doc, runTransaction, orderBy } from 'firebase/firestore';
import { toast } from 'react-toastify';

const DepositApproval = () => {
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // To disable buttons during an operation

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'depositRequests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const deposits = [];
      querySnapshot.forEach((doc) => {
        deposits.push({ id: doc.id, ...doc.data() });
      });
      setPendingDeposits(deposits);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (deposit) => {
    if (processingId) return;
    setProcessingId(deposit.id);

    const depositRef = doc(db, 'depositRequests', deposit.id);
    const userRef = doc(db, 'users', deposit.userId);

    try {
      await runTransaction(db, async (transaction) => {
        const depositDoc = await transaction.get(depositRef);
        if (!depositDoc.exists() || depositDoc.data().status !== 'pending') {
          throw new Error("This deposit request has already been processed.");
        }

        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User not found.");
        }

        const currentBalance = userDoc.data().balance || 0;
        const newBalance = currentBalance + deposit.amount;

        transaction.update(userRef, { balance: newBalance });
        transaction.update(depositRef, { status: 'approved' });
      });
      toast.success(`Deposit of $${deposit.amount} for ${deposit.displayName} approved.`);
    } catch (error) {
      console.error("Transaction failed: ", error);
      toast.error(`Failed to approve deposit: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (deposit) => {
    if (processingId) return;
    setProcessingId(deposit.id);

    const depositRef = doc(db, 'depositRequests', deposit.id);

    try {
        await runTransaction(db, async (transaction) => {
            const depositDoc = await transaction.get(depositRef);
            if (!depositDoc.exists() || depositDoc.data().status !== 'pending') {
              throw new Error("This deposit request has already been processed.");
            }
            transaction.update(depositRef, { status: 'rejected' });
        });
        toast.warn(`Deposit for ${deposit.displayName} was rejected.`);
    } catch (error) {
        console.error("Rejection failed: ", error);
        toast.error(`Failed to reject deposit: ${error.message}`);
    } finally {
        setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="p-8">Loading pending deposits...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pending Deposit Requests</h2>
      {pendingDeposits.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No pending requests at this time.</p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDeposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{deposit.displayName}</td>
                    <td className="p-3 font-semibold text-green-600">${deposit.amount.toFixed(2)}</td>
                    <td className="p-3 truncate max-w-xs">{deposit.transactionId}</td>
                    <td className="p-3 text-gray-500">{deposit.createdAt?.toDate().toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleApprove(deposit)}
                          disabled={processingId === deposit.id}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(deposit)}
                          disabled={processingId === deposit.id}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositApproval;
