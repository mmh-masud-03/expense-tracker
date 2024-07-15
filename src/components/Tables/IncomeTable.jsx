"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import IncomeForm from "../Income/IncomeForm";
import { toast } from "react-toastify";

export default function IncomeTable() {
  const [incomes, setIncomes] = useState([]);
  const [overview, setOverview] = useState({
    totalAmount: 0,
    categoryCounts: {},
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchIncome = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/income?page=${page}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${searchTerm}&category=${filterCategory}`
      );
      if (!res.ok) throw new Error("Failed to fetch income data");
      const { incomes, totalPages, totalAmount, categoryCounts } =
        await res.json();
      setIncomes(incomes);
      setOverview({
        totalAmount,
        categoryCounts,
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
  }, [currentPage, sortBy, sortOrder, searchTerm, filterCategory]);

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

  const categories = useMemo(
    () => Object.keys(overview.categoryCounts),
    [overview.categoryCounts]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-6 container mx-auto mb-6 bg-slate-200 rounded-lg shadow-lg">
      <>
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row  mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search income..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Title</span>
                    <SortIcon column="title" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    <SortIcon column="category" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    <SortIcon column="amount" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <SortIcon column="date" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <>
                {incomes.length > 0 ? (
                  incomes.map((income, index) => (
                    <tr key={income._id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {income.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {income.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {income.amount.toFixed(2)} Tk
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(income.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                    >
                      No income found
                    </td>
                  </tr>
                )}
              </>
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => currentPage > 1 && fetchIncome(currentPage - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              currentPage < totalPages && fetchIncome(currentPage + 1)
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>

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
      </>
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
