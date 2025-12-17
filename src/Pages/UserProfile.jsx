import { ArrowLeft, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

export default function UserProfile() {
  const user = useAuthStore((state) => state.user);

  const referralCode = user?.referralCode || "N/A";
  const invitationLink = user?.uid ? `https://payeveryone.net/register?refer=${user.referralCode}` : "N/A";

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(message);
      },
      (err) => {
        toast.error("Failed to copy.");
        console.error("Could not copy text: ", err);
      }
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center">
        <p>Loading user data or not logged in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative">
          <Link to="/Profile" className="absolute top-4 left-4">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-center text-xl font-semibold">User Details</h2>
        </div>

        {/* User Details */}
        <div className="px-4 py-4 space-y-3">
          <DetailItem label="Full Name" value={user.fullName || "N/A"} />
          <DetailItem label="Email" value={user.email || "N/A"} />
          <DetailItem label="User ID" value={user.uid ? user.uid.substring(0, 6) : "N/A"} />
          <DetailItem label="Invitation Code" value={referralCode}
            onCopy={() => copyToClipboard(referralCode, "Invitation code copied!")}
          />
          <div className="flex items-center justify-between bg-slate-100 px-4 py-3 rounded-lg">
            <span className="text-sm text-gray-700">Invitation Link</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                {invitationLink}
              </span>
              <button onClick={() => copyToClipboard(invitationLink, "Invitation link copied!")}>
                <Copy size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(invitationLink, "Invitation link copied!")}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-2 font-semibold"
          >
            Copy Referral Link
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, onCopy }) {
  return (
    <div className="flex items-center justify-between bg-slate-100 px-4 py-3 rounded-lg">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">{value}</span>
        {onCopy && (
          <button onClick={onCopy}>
            <Copy size={16} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
