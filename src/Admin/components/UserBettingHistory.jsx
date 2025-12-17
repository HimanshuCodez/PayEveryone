import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { db } from '../../firebase';
import Loader from '../../components/Loader';

const UserBettingHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // Queries for all history types
        const wingameBetsQuery = query(collection(db, 'wingame_bets'), where('userId', '==', userId));
        const harufBetsQuery = query(collection(db, 'harufBets'), where('userId', '==', userId));
        const rouletteBetsQuery = query(collection(db, 'rouletteBets'), where('userId', '==', userId));
        const depositsQuery = query(collection(db, 'top-ups'), where('userId', '==', userId));
        const withdrawalsQuery = query(collection(db, 'withdrawals'), where('userId', '==', userId));
        const otherTransactionsQuery = query(collection(db, 'transactions'), where('userId', '==', userId));

        const [
            wingameSnapshot,
            harufSnapshot,
            rouletteSnapshot,
            depositsSnapshot,
            withdrawalsSnapshot,
            transactionsSnapshot
        ] = await Promise.all([
          getDocs(wingameBetsQuery),
          getDocs(harufBetsQuery),
          getDocs(rouletteBetsQuery),
          getDocs(depositsQuery),
          getDocs(withdrawalsQuery),
          getDocs(otherTransactionsQuery),
        ]);

        // Normalize WinGo bets
        const wingameBets = wingameSnapshot.docs.map(doc => {
            const data = doc.data();
            let payout = 0;
            if (data.status === 'win') payout = data.winnings || 0;
            else if (data.status === 'loss') payout = -data.amount;
            return {
                ...data,
                id: doc.id,
                gameType: 'WinGo',
                date: data.createdAt?.toDate(),
                betValue: data.number,
                resultValue: 'N/A', // will be filled later
                payout: payout,
            };
        }).filter(bet => bet.date);

        // Fetch WinGo round results
        const roundIds = [...new Set(wingameBets.map(bet => String(bet.roundId)))];
        if (roundIds.length > 0) {
            const roundsQuery = query(collection(db, 'wingame_rounds'), where(documentId(), 'in', roundIds));
            const roundsSnapshot = await getDocs(roundsQuery);
            const resultsMap = {};
            roundsSnapshot.forEach(doc => {
              resultsMap[doc.id] = doc.data().winningNumber;
            });
            wingameBets.forEach(bet => {
                bet.resultValue = resultsMap[bet.roundId] ?? 'N/A';
            });
        }
        
        // Normalize Haruf bets
        const harufBets = harufSnapshot.docs.map(doc => {
            const data = doc.data();
            let payout = 0;
            if (data.status === 'win') payout = data.winnings || 0;
            else if (data.status === 'loss') payout = -data.betAmount;
            return {
                ...data,
                id: doc.id,
                gameType: `Haruf - ${data.marketName}`,
                date: data.timestamp?.toDate(),
                betValue: data.selectedNumber,
                resultValue: data.winningNumber ?? 'N/A',
                amount: data.betAmount,
                payout: payout
            };
        }).filter(bet => bet.date);

        // Normalize Roulette bets
        const rouletteBets = rouletteSnapshot.docs.map(doc => {
            const data = doc.data();
            let payout = 0;
            if (data.status === 'win') payout = data.winnings || 0;
            else if (data.status === 'loss') payout = -data.betAmount;
            return {
                ...data,
                id: doc.id,
                gameType: 'Roulette',
                date: data.timestamp?.toDate(),
                betValue: data.betType,
                resultValue: 'N/A',
                amount: data.betAmount,
                payout: payout
            };
        }).filter(bet => bet.date);
        
        // Normalize Deposits
        const deposits = depositsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                gameType: 'Deposit',
                date: data.createdAt?.toDate(),
                betValue: 'N/A',
                resultValue: 'N/A',
                amount: data.amount,
                payout: data.status === 'approved' ? data.amount : 0,
            };
        }).filter(item => item.date);

        // Normalize Withdrawals
        const withdrawals = withdrawalsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                gameType: 'Withdrawal',
                date: data.createdAt?.toDate(),
                betValue: 'N/A',
                resultValue: 'N/A',
                amount: data.amount,
                payout: data.status === 'approved' ? -data.amount : 0,
            };
        }).filter(item => item.date);

        // Normalize other transactions (Admin Credit, Referral Bonus)
        const otherTransactions = transactionsSnapshot.docs.map(doc => {
            const data = doc.data();
            let gameType = '';
            let payout = 0;
            if (data.type === 'admin_credit') {
                gameType = 'Admin Credit';
                payout = data.amount;
            }
            if (data.type === 'referral_bonus') {
                gameType = 'Referral Bonus';
                payout = data.amount;
            }
            if (!gameType) return null;

            return {
                ...data,
                id: doc.id,
                gameType: gameType,
                date: data.createdAt?.toDate(),
                betValue: 'N/A',
                resultValue: 'N/A',
                amount: data.amount,
                payout: payout,
            };
        }).filter(item => item && item.date);


        const combinedHistory = [...wingameBets, ...harufBets, ...rouletteBets, ...deposits, ...withdrawals, ...otherTransactions];
        combinedHistory.sort((a, b) => b.date.getTime() - a.date.getTime());

        setHistory(combinedHistory);

      } catch (error) {
        console.error("Error fetching user history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center p-8"><Loader /></div>;
  }

  // Calculate totals
  const totalCredits = history.reduce((acc, item) => (item.payout > 0 ? acc + item.payout : acc), 0);
  const totalDebits = history.reduce((acc, item) => (item.payout < 0 ? acc + item.payout : acc), 0);
  const totalCreditCount = history.filter(item => item.payout > 0).length;
  const totalDebitCount = history.filter(item => item.payout < 0).length;

  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Full History</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-sm text-green-800">Total Credits ({totalCreditCount})</p>
            <p className="text-2xl font-bold text-green-600">+₹{totalCredits.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-sm text-red-800">Total Debits ({totalDebitCount})</p>
            <p className="text-2xl font-bold text-red-600">₹{totalDebits.toFixed(2)}</p>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No history found for this user.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-center">Bet/Info</th>
                <th className="p-3 text-center">Result</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Credit/Debit</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-100">
                  <td className="p-3 text-xs text-gray-600">{item.date.toLocaleString()}</td>
                  <td className="p-3 font-medium text-gray-800">{item.gameType}</td>
                  <td className="p-3 text-center font-bold text-lg">{item.betValue}</td>
                  <td className="p-3 text-center font-bold text-lg text-blue-600">{item.resultValue}</td>
                  <td className="p-3 text-right">₹{item.amount.toFixed(2)}</td>
                  <td className={`p-3 text-center font-semibold capitalize ${
                    item.status === 'win' || item.status === 'approved' ? 'text-green-500' :
                    item.status === 'loss' || item.status === 'rejected' ? 'text-red-500' :
                    item.status === 'pending' ? 'text-yellow-500' : 'text-gray-500'
                  }`}>
                    {item.status || 'Pending'}
                  </td>
                  <td className={`p-3 text-right font-bold ${
                    item.payout > 0 ? 'text-green-500' : item.payout < 0 ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {item.payout > 0 ? `+₹${item.payout.toFixed(2)}` : item.payout < 0 ? `-₹${Math.abs(item.payout).toFixed(2)}` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserBettingHistory;
