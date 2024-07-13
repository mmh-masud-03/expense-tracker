// components/TransactionList.js
export default function TransactionList() {
  const transactions = [
    {
      id: 1,
      name: "Spotify",
      description: "Spotify Premium",
      amount: 25.0,
      date: "16 oct 2023",
      status: "Success",
    },
    {
      id: 2,
      name: "Netflix",
      description: "Netflix Premium",
      amount: 45.25,
      date: "17 oct 2023",
      status: "Success",
    },
    {
      id: 3,
      name: "Pratama Arhan",
      description: "pratama@gmail.com",
      amount: 19.5,
      date: "17 oct 2023",
      status: "Failed",
    },
    {
      id: 4,
      name: "Sketch",
      description: "Annually membership",
      amount: 50.0,
      date: "18 oct 2023",
      status: "Failed",
    },
  ];

  return (
    <div className="mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`/${transaction.name.toLowerCase()}-logo.png`}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{transaction.date}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.status === "Success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
