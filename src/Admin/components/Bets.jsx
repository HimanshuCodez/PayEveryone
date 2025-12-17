import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import Loader from '../../components/Loader';

const Bets = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const collections = [
            { name: 'wingame_bets', dateField: 'createdAt' },
            { name: 'harufBets', dateField: 'timestamp' },
            { name: 'rouletteBets', dateField: 'timestamp' }
        ];

        const unsubscribes = collections.map(({ name, dateField }) => {
            const q = query(collection(db, name), orderBy(dateField, 'desc'), limit(100)); // Fetch latest 100 from each
            
            return onSnapshot(q, (snapshot) => {
                const fetchedBets = snapshot.docs.map(d => {
                    const data = d.data();
                    const date = data[dateField]?.toDate();
                    let gameType = 'Unknown';
                    if (name === 'wingame_bets') gameType = 'WinGo';
                    if (name === 'harufBets') gameType = `Haruf - ${data.marketName}`;
                    if (name === 'rouletteBets') gameType = 'Roulette';

                    return {
                        id: d.id,
                        userId: data.userId,
                        gameType,
                        date,
                        amount: data.amount || data.betAmount,
                        status: data.status || 'pending',
                        winnings: data.winnings || 0,
                        betValue: data.number || data.selectedNumber || data.betType,
                    };
                }).filter(bet => bet.date && bet.userId);

                // Fetch user details for new bets
                const newUserIds = [...new Set(fetchedBets.map(b => b.userId).filter(id => !userDetails[id]))];
                if (newUserIds.length > 0) {
                    const fetchUsers = async () => {
                        const users = {};
                        for (const userId of newUserIds) {
                            try {
                                const userDoc = await getDoc(doc(db, 'users', userId));
                                if (userDoc.exists()) {
                                    users[userId] = userDoc.data();
                                }
                            } catch (e) { console.error("Error fetching user", e); }
                        }
                        setUserDetails(prev => ({ ...prev, ...users }));
                    };
                    fetchUsers();
                }

                // Update state with new bets, replacing old ones from the same game type
                setHistory(prevHistory => {
                    const otherHistory = prevHistory.filter(bet => bet.gameType !== fetchedBets[0]?.gameType);
                    const merged = [...otherHistory, ...fetchedBets];
                    merged.sort((a, b) => b.date.getTime() - a.date.getTime());
                    return merged;
                });

                setLoading(false);
            }, (error) => {
                console.error(`Error fetching ${name}:`, error);
                setLoading(false);
            });
        });

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [userDetails]); // Dependency ensures we can use userDetails cache

    if (loading && history.length === 0) {
        return <div className="flex justify-center items-center p-8"><Loader /></div>;
    }

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Global Betting History</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-gray-600 text-sm">
                            <th className="p-3">Date</th>
                            <th className="p-3">User</th>
                            <th className="p-3">Game</th>
                            <th className="p-3 text-center">Bet</th>
                            <th className="p-3 text-right">Amount</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-right">Payout</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(bet => (
                            <tr key={bet.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="p-3 text-xs text-gray-600">{bet.date ? bet.date.toLocaleString() : 'N/A'}</td>
                                <td className="p-3 text-sm font-medium text-blue-600">
                                    {userDetails[bet.userId]?.name || userDetails[bet.userId]?.email || bet.userId}
                                </td>
                                <td className="p-3 font-medium">{bet.gameType}</td>
                                <td className="p-3 text-center font-bold">{bet.betValue}</td>
                                <td className="p-3 text-right">₹{bet.amount.toFixed(2)}</td>
                                <td className={`p-3 text-center font-semibold capitalize ${
                                    bet.status === 'win' ? 'text-green-500' : bet.status === 'loss' ? 'text-red-500' : 'text-gray-500'
                                }`}>
                                    {bet.status}
                                </td>
                                <td className={`p-3 text-right font-bold ${
                                    bet.status === 'win' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                    {bet.status === 'win' ? `+₹${bet.winnings.toFixed(2)}` : bet.status === 'loss' ? `-₹${bet.amount.toFixed(2)}` : 'Pending'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {history.length === 0 && !loading && <p className="text-center text-gray-500 py-8">No bets found.</p>}
        </div>
    );
};

export default Bets;
