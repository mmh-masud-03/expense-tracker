// components/ActiveCards.js
export default function ActiveCards() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">My cards</h2>
      <p className="text-3xl font-bold mb-2">3 cards active</p>
      <p className="text-sm text-gray-500 mb-4">
        integration your card in Mirauve
      </p>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 text-white">
        <img src="/wisely-logo.svg" alt="Wisely" className="h-8 mb-4" />
        <p className="text-xl mb-4">•••• •••• •••• 2468</p>
        <p className="text-sm">VISA</p>
      </div>
      <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        + Add new card
      </button>
    </div>
  );
}
