import { useState, useEffect } from "react";
import { ArrowLeft, Banknote, Landmark, QrCode, Upload, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import useAuthStore from '../store/authStore';
import { motion } from "framer-motion";

export default function Bank() {
  const [method, setMethod] = useState("bank"); // 'bank', 'upi', or 'qr'
  const [bankName, setBankName] = useState("");
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loadingQr, setLoadingQr] = useState(true);

  // State for QR upload
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    setLoadingQr(true); // Used for all loading now
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Populate bank details
        if (data.bankDetails) {
          setBankName(data.bankDetails.bankName || "");
          setHolderName(data.bankDetails.holderName || "");
          setAccountNumber(data.bankDetails.accountNumber || "");
          setIfscCode(data.bankDetails.ifscCode || "");
        }
        // Populate UPI ID
        setUpiId(data.upiId || "");
        // Populate QR Code
        setQrCodeUrl(data.userQrCodeUrl || '');
      } else {
        // Reset all fields if user doc doesn't exist
        setBankName("");
        setHolderName("");
        setAccountNumber("");
        setIfscCode("");
        setUpiId("");
        setQrCodeUrl('');
      }
      setLoadingQr(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to save details.");
      return;
    }

    setSubmitting(true);
    const userDocRef = doc(db, 'users', user.uid);

    try {
      if (method === "upi") {
        const upiRegex = /^[\w.-]+@[\w.-]+$/;
        if (!upiRegex.test(upiId)) {
          throw new Error("Please enter a valid UPI ID.");
        }
        await setDoc(userDocRef, { upiId: upiId }, { merge: true });
        toast.success("UPI ID saved successfully!");

      } else if (method === "bank") {
        if (!bankName || !holderName || !accountNumber || !ifscCode) {
          throw new Error("Please fill all bank detail fields.");
        }
        const bankDetails = { bankName, holderName, accountNumber, ifscCode };
        await setDoc(userDocRef, { bankDetails: bankDetails }, { merge: true });
        toast.success("Bank details saved successfully!");
      }
    } catch (error) {
      console.error("Error saving details:", error);
      toast.error(error.message || "Failed to save details.");
    } finally {
      setSubmitting(false);
    }
  };

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
    if (!user) {
      toast.error("You must be logged in to upload a QR code.");
      return;
    }

    setSubmitting(true);
    const storageRef = ref(storage, `user_qrcodes/${user.uid}/${Date.now()}_${qrCodeFile.name}`);
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
        setSubmitting(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { userQrCodeUrl: downloadURL }, { merge: true });
            setQrCodeUrl(downloadURL);
            toast.success("Your QR Code has been updated!");
          } catch (dbError) {
            console.error("Database error:", dbError);
            toast.error("Failed to save your QR code.");
          } finally {
            setSubmitting(false);
            setQrCodeFile(null);
            setUploadProgress(0);
          }
        });
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative"
        >
          <Link to="/Profile" className="absolute top-4 left-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ArrowLeft size={24} />
            </motion.div>
          </Link>
          <h2 className="text-center text-xl font-semibold">
            Add Withdrawal Method
          </h2>
        </motion.div>

        {/* Toggle */}
        <div className="px-4 pt-4 pb-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="flex rounded-full bg-slate-200 p-1 shadow-inner">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMethod("bank")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  method === "bank"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-gray-600"
                }`}
              >
                <Landmark size={18} />
                Bank
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMethod("upi")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  method === "upi"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-gray-600"
                }`}
              >
                <Banknote size={18} />
                UPI
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMethod("qr")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  method === "qr"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-gray-600"
                }`}
              >
                <QrCode size={18} />
                QR Code
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Form and Saved Details */}
        <div className="px-5 pb-8">
          <motion.div
            key={method}
            initial={{ opacity: 0, x: method === "bank" ? -20 : method === "upi" ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: method === "bank" ? 20 : method === "upi" ? 0 : -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {method === "bank" ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-lg font-bold text-gray-800 pt-2">Update Bank Details</h3>
                  <FormInput label="Bank Name:" placeholder="Enter Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  <FormInput label="Ac Holder Name:" placeholder="Enter Bank Ac Holder Name" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
                  <FormInput label="Account Number:" placeholder="Enter Account Number" type="number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                  <FormInput label="Bank IFSC Code:" placeholder="Enter IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
                  <SubmitButton isSubmitting={submitting} />
                </form>
                {accountNumber && (
                  <div className="pt-4 border-t mt-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Saved Bank Account</h3>
                    <div className="p-4 bg-slate-50 rounded-lg space-y-2 text-sm">
                      <p><strong>Bank:</strong> {bankName}</p>
                      <p><strong>Holder:</strong> {holderName}</p>
                      <p><strong>Account No:</strong> {accountNumber}</p>
                      <p><strong>IFSC:</strong> {ifscCode}</p>
                    </div>
                  </div>
                )}
              </>
            ) : method === "upi" ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-lg font-bold text-gray-800 pt-2">Update UPI ID</h3>
                  <FormInput label="UPI ID:" placeholder="example@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                  <SubmitButton isSubmitting={submitting}/>
                </form>
                {upiId && (
                  <div className="pt-4 border-t mt-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Saved UPI ID</h3>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-semibold text-center">{upiId}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="pt-2">
                <div className="bg-white rounded-lg mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Your Current QR Code</h3>
                  {loadingQr ? (
                    <p className="text-center text-gray-500">Loading...</p>
                  ) : qrCodeUrl ? (
                    <div className="flex justify-center items-center p-4 border rounded-lg">
                      <img src={qrCodeUrl} alt="Your UPI QR Code" className="max-w-xs max-h-48 rounded" />
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">You have not uploaded a QR code.</p>
                  )}
                </div>

                <div className="bg-white rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Upload New QR Code</h3>
                  <div className="flex flex-col items-center gap-4">
                    <label htmlFor="qr-upload" className="w-full flex justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                      {qrCodeFile ? (
                        <div className="text-center text-green-600">
                          <CheckCircle size={40} className="mx-auto" />
                          <p className="font-semibold mt-2 text-sm">{qrCodeFile.name}</p>
                          <p className="text-xs text-gray-500">Ready to upload.</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <Upload size={40} className="mx-auto" />
                          <p className="font-semibold mt-2">Click to select an image</p>
                          <p className="text-sm">PNG, JPG, GIF</p>
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
                    {submitting && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}
                    <button
                      onClick={handleUpload}
                      disabled={submitting || !qrCodeFile}
                      className="w-full bg-blue-600 text-white font-bold px-8 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {submitting ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload & Save QR'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function SubmitButton({ isSubmitting }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      type="submit"
      disabled={isSubmitting}
      className="w-full mt-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 disabled:opacity-70"
    >
      {isSubmitting ? 'Saving...' : 'Save Details'}
    </motion.button>
  );
}

function FormInput({ label, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <motion.input
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
        className="w-full p-4 border border-gray-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
      />
    </motion.div>
  );
}