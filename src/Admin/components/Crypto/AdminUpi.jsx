import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { toast } from 'react-toastify';
import { Upload, CheckCircle } from 'lucide-react';

const AdminUpi = () => {
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const docRef = doc(db, 'paymentMethods', 'qrCode');

  // Fetch the current QR code URL
  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQrCodeUrl(docSnap.data().url);
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
        toast.error("Failed to fetch current QR code.");
      } finally {
        setFetching(false);
      }
    };
    fetchQrCode();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setQrCodeFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!qrCodeFile) {
      toast.error("Please select a QR code image first.");
      return;
    }

    setLoading(true);
    const storageRef = ref(storage, `qrcodes/${Date.now()}_${qrCodeFile.name}`);
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
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            await setDoc(docRef, { url: downloadURL });
            setQrCodeUrl(downloadURL);
            toast.success("QR Code updated successfully!");
          } catch (dbError) {
            console.error("Database error:", dbError);
            toast.error("Failed to save QR code URL.");
          } finally {
            setLoading(false);
            setQrCodeFile(null);
            setUploadProgress(0);
          }
        });
      }
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Update UPI QR Code</h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Current QR Code</h3>
          {fetching ? (
            <p>Loading current QR code...</p>
          ) : qrCodeUrl ? (
            <div className="flex justify-center items-center p-4 border rounded-lg">
              <img src={qrCodeUrl} alt="Current UPI QR Code" className="max-w-xs max-h-64 rounded" />
            </div>
          ) : (
            <p>No QR code has been uploaded yet.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Upload New QR Code</h3>
          <div className="flex flex-col items-center gap-4">
            <label htmlFor="qr-upload" className="w-full flex justify-center px-6 py-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
              {qrCodeFile ? (
                <div className="text-center text-green-600">
                  <CheckCircle size={48} className="mx-auto" />
                  <p className="font-semibold mt-2">{qrCodeFile.name}</p>
                  <p className="text-sm text-gray-500">File selected. Ready to upload.</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Upload size={48} className="mx-auto" />
                  <p className="font-semibold mt-2">Click to select an image</p>
                  <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
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
            {loading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={loading || !qrCodeFile}
              className="w-full bg-blue-600 text-white font-bold px-8 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload & Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpi;
