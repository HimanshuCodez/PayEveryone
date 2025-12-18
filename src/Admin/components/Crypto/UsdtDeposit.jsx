import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { toast } from 'react-toastify';
import { Upload, CheckCircle } from 'lucide-react';

const UsdtDeposit = () => {
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [currentQrCodeUrl, setCurrentQrCodeUrl] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const docRef = doc(db, 'paymentMethods', 'usdtDeposit');

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentQrCodeUrl(data.qrCodeUrl || '');
          setWalletAddress(data.walletAddress || '');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch current deposit info.");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setQrCodeFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    setLoading(true);

    if (qrCodeFile) {
      // If a new QR code is being uploaded
      const storageRef = ref(storage, `usdtdeposit/${Date.now()}_${qrCodeFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, qrCodeFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          toast.error("Failed to upload image.");
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // New QR url and current wallet address
            updateFirestore(downloadURL, walletAddress);
          });
        }
      );
    } else {
      // If only the wallet address is being updated
      updateFirestore(currentQrCodeUrl, walletAddress);
    }
  };

  const updateFirestore = async (qrUrl, address) => {
    try {
      await setDoc(docRef, { qrCodeUrl: qrUrl, walletAddress: address });
      setCurrentQrCodeUrl(qrUrl); // Update the displayed QR
      toast.success("Deposit info updated successfully!");
    } catch (dbError) {
      console.error("Database error:", dbError);
      toast.error("Failed to save deposit info.");
    } finally {
      setLoading(false);
      setQrCodeFile(null);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Update USDT Deposit Info</h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Current Deposit Info</h3>
          {fetching ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-600 mb-2">QR Code</h4>
                {currentQrCodeUrl ? (
                  <img src={currentQrCodeUrl} alt="Current USDT QR Code" className="max-w-xs max-h-48 rounded border p-1" />
                ) : (
                  <p>No QR code uploaded.</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-600 mb-2">TRC-20 Wallet Address</h4>
                <p className="p-2 bg-gray-100 rounded break-all">{walletAddress || 'No address set.'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Update Information</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TRC-20 Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter TRC-20 Wallet Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update QR Code (Optional)</label>
              <label htmlFor="qr-upload" className="w-full flex justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                {qrCodeFile ? (
                  <div className="text-center text-green-600">
                    <CheckCircle size={40} className="mx-auto" />
                    <p className="font-semibold mt-2">{qrCodeFile.name}</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Upload size={40} className="mx-auto" />
                    <p className="font-semibold mt-2">Click to select a new image</p>
                  </div>
                )}
              </label>
              <input
                id="qr-upload"
                type="file"
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {loading && uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold px-8 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? (qrCodeFile ? `Uploading... ${Math.round(uploadProgress)}%` : 'Saving...') : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsdtDeposit;
