import {
  FaEdit,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTrash,
} from "react-icons/fa";

export default function BudgetTable({
  sortedData,
  requestSort,
  sortConfig,
  onUpdate,
  handleDelete,
  confirmModal,
  setConfirmModal,
}) {
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  function ConfirmDeleteModal({ onConfirm, onCancel }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md">
          <p>Are you sure you want to delete this budget?</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={onConfirm}
            >
              Yes, delete it
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg shadow">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            <th
              className="py-3 px-4 uppercase text-sm text-left cursor-pointer hover:bg-gray-300"
              onClick={() => requestSort("month")}
            >
              Month{" "}
              {getClassNamesFor("month") === "ascending" ? (
                <FaSortAmountUp className="inline" size={12} />
              ) : (
                <FaSortAmountDown className="inline" size={12} />
              )}
            </th>
            <th
              className="py-3 px-4 uppercase text-sm text-left cursor-pointer hover:bg-gray-300"
              onClick={() => requestSort("year")}
            >
              Year{" "}
              {getClassNamesFor("year") === "ascending" ? (
                <FaSortAmountUp className="inline" size={12} />
              ) : (
                <FaSortAmountDown className="inline" size={12} />
              )}
            </th>
            <th
              className="py-3 px-4 uppercase text-sm text-left cursor-pointer hover:bg-gray-300"
              onClick={() => requestSort("amount")}
            >
              Amount{" "}
              {getClassNamesFor("amount") === "ascending" ? (
                <FaSortAmountUp className="inline" size={12} />
              ) : (
                <FaSortAmountDown className="inline" size={12} />
              )}
            </th>
            <th className="py-3 px-4 uppercase text-sm text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {sortedData.map((budget, index) => (
            <tr
              key={`${budget.month}-${budget.year}-${index}`}
              className={`hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4">{budget.month}</td>
              <td className="py-3 px-4">{budget.year}</td>
              <td className="py-3 px-4">{budget.amount.toFixed(2)} TK</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onUpdate(budget)}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() =>
                    setConfirmModal({ open: true, id: budget._id })
                  }
                >
                  <FaTrash />
                </button>
                {confirmModal.open && confirmModal.id === budget._id && (
                  <ConfirmDeleteModal
                    onConfirm={() => handleDelete(confirmModal.id)}
                    onCancel={() => setConfirmModal({ open: false, id: null })}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
