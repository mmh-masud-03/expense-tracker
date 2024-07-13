// components/SavingsPlans.js
export default function SavingsPlans() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Savings plan</h2>
      <p className="text-3xl font-bold mb-2">3 saving plans</p>
      <a href="#" className="text-blue-500 hover:underline">
        See more detail Here
      </a>
      <div className="mt-4 space-y-4">
        {/* Saving plan items */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">New Setup Vinyl</p>
            <p className="text-sm text-gray-500">$752.00 / $1,200.00</p>
          </div>
          <div className="w-1/3 bg-purple-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: "62%" }}
            ></div>
          </div>
        </div>
        {/* Add more saving plan items */}
      </div>
    </div>
  );
}
