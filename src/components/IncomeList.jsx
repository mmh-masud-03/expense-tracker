"use client";
import { useEffect, useState } from "react";
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash } from "react-icons/fa";
import IncomeForm from "./IncomeForm";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function IncomeList() {
  const [incomes, setIncomes] = useState([]);
  const [overview, setOverview] = useState({
    totalAmount: 0,
    averageAmount: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchIncome = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/income?page=${page}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (!res.ok) throw new Error("Failed to fetch income data");
      const { incomes, totalPages, totalAmount } = await res.json();
      setIncomes(incomes);
      setOverview({
        totalAmount,
        averageAmount: incomes.length > 0 ? totalAmount / incomes.length : 0,
      });
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      setError("Failed to fetch income data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome(currentPage);
  }, [currentPage, sortBy, sortOrder]);

  const handleUpdate = (income) => {
    setSelectedIncome(income);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/income/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConfirmModal({ open: false, id: null });
        toast("Income deleted successfully", { type: "success" });
        fetchIncome(currentPage);
      } else {
        setError("Failed to delete income");
      }
    } catch (error) {
      setError("Error deleting income");
    }
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    setSortOrder(sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc");
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <FaSort className="text-gray-400" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="text-blue-500" />
    ) : (
      <FaSortDown className="text-blue-500" />
    );
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-6 container mx-auto mb-6 bg-slate-200/60 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Income</h2>
      <OverviewSection overview={overview} />

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  <SortIcon column="title" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <SortIcon column="category" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <SortIcon column="amount" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon column="date" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {incomes.length > 0 ? (
                incomes.map((income, index) => (
                  <motion.tr
                    key={income._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {income.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {income.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {income.amount.toFixed(2)} Tk
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(income.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleUpdate(income)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit className="inline-block" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({ open: true, id: income._id })
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline-block" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan="5"
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No income found
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchIncome}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedIncome ? "Update Income" : "Add Income"}
              </h3>
              <div className="mt-2 text-left py-3">
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedIncome(null);
                    }}
                    className="text-red-500 hover:text-red-700 text-2xl"
                  >
                    &times;
                  </button>
                </div>
                <IncomeForm
                  income={selectedIncome}
                  onClose={() => {
                    setIsModalOpen(false);
                    setSelectedIncome(null);
                    fetchIncome(currentPage);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmModal.open && (
        <ConfirmDeleteModal
          onConfirm={() => handleDelete(confirmModal.id)}
          onCancel={() => setConfirmModal({ open: false, id: null })}
        />
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto p-4 mb-6 bg-white rounded shadow-md flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Loading...</span>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="container mx-auto p-4 mb-6 bg-red-100 text-red-700 rounded shadow-md">
      Error: {error}
    </div>
  );
}

function OverviewSection({ overview }) {
  return (
    <div className="mb-6 p-4 bg-blue-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">Overview</h3>
      <div className="flex justify-between text-gray-700">
        <OverviewItem
          label="Total Amount"
          value={overview.totalAmount}
          color="green"
        />
        <OverviewItem
          label="Average Amount"
          value={overview.averageAmount}
          color="blue"
        />
      </div>
    </div>
  );
}

function OverviewItem({ label, value, color }) {
  return (
    <div>
      <div className="text-lg font-bold mb-1">{label}</div>
      <div className={`text-xl text-${color}-700`}>BDT {value.toFixed(2)}</div>
    </div>
  );
}

function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md">
        <p>Are you sure you want to delete this income?</p>
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

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="mt-4 flex justify-between items-center">
      <PaginationButton
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </PaginationButton>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <PaginationButton
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage >= totalPages}
      >
        Next
      </PaginationButton>
    </div>
  );
}

function PaginationButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-colors duration-200
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
