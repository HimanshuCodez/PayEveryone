import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';

const UsdtRates = () => {
  const [marketPrice, setMarketPrice] = useState('');
  const [ourPrice, setOurPrice] = useState('');
  const [liveRates, setLiveRates] = useState([]);
  const [loading, setLoading] = useState(false);

  const docRef = doc(db, 'marketData', 'prices');

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMarketPrice(data.marketPrice || '');
        setOurPrice(data.ourPrice || '');
        setLiveRates(data.liveRates || []);
      } else {
        console.log("No such document!");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRateChange = (index, field, value) => {
    const newRates = [...liveRates];
    newRates[index][field] = value;
    setLiveRates(newRates);
  };

  const handleAddRate = () => {
    setLiveRates([...liveRates, { name: '', price: '', change: '', color: 'text-green-500', bg: 'bg-gray-500' }]);
  };

  const handleRemoveRate = (index) => {
    const newRates = liveRates.filter((_, i) => i !== index);
    setLiveRates(newRates);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(docRef, {
        marketPrice,
        ourPrice,
        liveRates,
      });
      toast.success('USDT rates updated successfully!');
    } catch (error) {
      console.error('Error updating document: ', error);
      toast.error('Failed to update USDT rates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Update USDT Prices</h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Market Price (₹)</label>
            <input
              type="text"
              value={marketPrice}
              onChange={(e) => setMarketPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 93.81"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Our Price (₹)</label>
            <input
              type="text"
              value={ourPrice}
              onChange={(e) => setOurPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 98.20"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Live USDT Rates</h3>
            <button
              onClick={handleAddRate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Plus size={18} /> Add Rate
            </button>
          </div>

          <div className="space-y-4">
            {liveRates.map((rate, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-gray-50">
                <input
                  type="text"
                  value={rate.name}
                  onChange={(e) => handleRateChange(index, 'name', e.target.value)}
                  placeholder="Exchange Name"
                  className="p-2 border rounded-md"
                />
                <input
                  type="text"
                  value={rate.price}
                  onChange={(e) => handleRateChange(index, 'price', e.target.value)}
                  placeholder="Price ($)"
                  className="p-2 border rounded-md"
                />
                <input
                  type="text"
                  value={rate.change}
                  onChange={(e) => handleRateChange(index, 'change', e.target.value)}
                  placeholder="Change (%)"
                  className="p-2 border rounded-md"
                />
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleRemoveRate(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 text-white font-bold px-8 py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsdtRates;
