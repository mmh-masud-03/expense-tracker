import { FiInfo } from "react-icons/fi";

// components/BalanceOverview.js
export default function BalanceOverview() {
  return (
    <div className="relative shadow-lg bg-gradient-to-br from-[#1e293b] to-[#3b4252] rounded-lg p-6 text-white w-1/2 h-44">
      <h2 className="text-2xl font-bold mb-2">Balance overview</h2>
      <p className="text-4xl font-bold mb-2">$21,847.00</p>
      <p className="text-sm">Extra savings $2,992.00</p>
      <p className="text-xs mb-4">Combination of bank accounts</p>
      <div className="flex space-x-2">{/* Add bank icons here */}</div>
      <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
        <FiInfo size={24} />
      </button>
    </div>
  );
}
