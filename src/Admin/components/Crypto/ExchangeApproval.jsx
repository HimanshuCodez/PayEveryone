import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, runTransaction, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { toast } from "react-toastify";

export default function ExchangeApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ourPrice, setOurPrice] = useState(0);

  useEffect(() => {
    const pricesDocRef = doc(db, 'marketData', 'prices');
    const unsubscribePrices = onSnapshot(pricesDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setOurPrice(parseFloat(docSnap.data().ourPrice) || 0);
      }
    });

    const q = collection(db, "exchangeRequests");
    const unsubscribeRequests = onSnapshot(q, async (querySnapshot) => {
      const requestsData = await Promise.all(querySnapshot.docs.map(async (d) => {
        const request = { id: d.id, ...d.data() };
        if (request.userId) {
          const userRef = doc(db, "users", request.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            request.name = userSnap.data().name;
            request.userPhoneNumber = userSnap.data().phoneNumber;
          }
        }
        return request;
      }));
      setRequests(requestsData.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    });

    return () => {
      unsubscribePrices();
      unsubscribeRequests();
    };
  }, []);

  const handleApprove = async (request) => {
    if (ourPrice === 0) {
      toast.error("USDT price is not available. Cannot process approval.");
      return;
    }
    const requestRef = doc(db, "exchangeRequests", request.id);
    const userRef = doc(db, "users", request.userId);
    const amountInUSDT = request.amount / ourPrice;

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw "User document not found!";
        }

        const newBalance = (userDoc.data().balance || 0) - amountInUSDT;
        if (newBalance < 0) {
          throw "User has insufficient balance for this transaction.";
        }
        
        transaction.update(userRef, { balance: newBalance });
        transaction.update(requestRef, { status: "approved" });
      });

      toast.success("Request approved successfully!");
    } catch (e) {
      console.error("Transaction failed: ", e);
      toast.error(`Failed to approve request: ${e.toString()}`);
      // Optionally reject the request if transaction fails
      await updateDoc(requestRef, { status: "failed", error: e.toString() });
    }
  };

  const handleReject = async (requestId) => {
    const requestRef = doc(db, "exchangeRequests", requestId);
    try {
      await updateDoc(requestRef, {
        status: "rejected",
      });
      toast.warn("Request rejected.");
    } catch (error) {
      toast.error("Failed to reject request.");
    }
  };

  const renderPaymentDetails = (method) => {
    if (!method) return <p>No details.</p>;
    switch (method.type) {
      case "Bank":
        return (
          <div className="text-xs">
            <p><strong>Bank:</strong> {method.details.bankName}</p>
            <p><strong>Holder:</strong> {method.details.holderName}</p>
            <p><strong>Acc No:</strong> {method.details.accountNumber}</p>
            <p><strong>IFSC:</strong> {method.details.ifscCode}</p>
          </div>
        );
      case "UPI":
        return <p className="font-mono">{method.details}</p>;
      case "QR":
        return <img src={method.details} alt="QR Code" className="w-24 h-24 rounded-md" />;
      default:
        return <p>Unknown method.</p>;
    }
  };
  
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Exchange Requests</h2>
      {loading ? <p>Loading requests...</p> : (
        <div className="space-y-4">
          {pendingRequests.length > 0 ? pendingRequests.map(request => (
            <div key={request.id} className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <p className="text-xs text-gray-500">User</p>
                <p className="font-semibold">{request.name || 'N/A'}</p>
                <p className="font-mono text-sm">{request.userPhoneNumber || request.userId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="font-bold text-lg">₹{request.amount.toFixed(2)}</p>
                 <p className="text-xs text-gray-500">≈ ${ (request.amount / ourPrice).toFixed(2) }</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Payment To</p>
                {renderPaymentDetails(request.paymentMethod)}
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => handleApprove(request)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">Approve</button>
                <button onClick={() => handleReject(request.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">Reject</button>
              </div>
            </div>
          )) : <p>No pending requests.</p>}
        </div>
      )}
        <h3 className="text-xl font-bold mb-4 mt-8 text-gray-700">Processed Requests</h3>
          <div className="space-y-4">
          {requests.filter(r => r.status !== 'pending').map(request => (
            <div key={request.id} className={`p-4 rounded-lg shadow-md opacity-70 ${request.status === 'approved' ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="font-semibold">{request.name || request.userId}</p>
              <p>₹{request.amount.toFixed(2)} - <span className={`font-bold uppercase text-sm ${request.status === 'approved' ? 'text-green-700' : 'text-red-700'}`}>{request.status}</span></p>
            </div>
          ))}
        </div>
    </div>
  );
}
