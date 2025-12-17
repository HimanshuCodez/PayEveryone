import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function TransHistory() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 pt-8 pb-10 relative">
          <Link to="/Profile" className="absolute top-4 left-4">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-center text-xl font-semibold">
            Transaction History
          </h2>
        </div>

        {/* No Record Found */}
        <div className="flex flex-col items-center justify-center h-80 text-gray-500">
          <FileText size={48} className="mb-4" />
          <p className="text-lg font-semibold">No Record Found</p>
        </div>
      </div>
    </div>
  );
}
