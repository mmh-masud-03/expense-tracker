"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import BudgetForm from "../Budget/BudgetForm";
import { toast } from "react-toastify";
import BudgetProgressBar from "../Budget/BudgetProgressBar";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("An error occurred while fetching the data.");
  return res.json();
};

export default function BudgetTable() {
  const [filters, setFilters] = useState({ month: "", year: "" });
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const { data, error, isValidating } = useSWR(
    `/api/budget?month=${filters.month}&year=${filters.year}&page=${page}&limit=${limit}&sortBy=${sortConfig.key}&sortOrder=${sortConfig.direction}&search=${searchTerm}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
    }
  );

  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    try {
      const res = await fetch("/api/expenses");
      const { expenses } = await res.json();
      setExpenses(expenses);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const sortedData = useMemo(() => {
    if (!data) return [];
    const budgetData = data.data;
    if (sortConfig.key !== null) {
      return [...budgetData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return budgetData;
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleUpdate = (budget) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/budget/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConfirmModal({ open: false, id: null });
        mutate(
          `/api/budget?month=${filters.month}&year=${filters.year}&page=${page}&limit=${limit}&sortBy=${sortConfig.key}&sortOrder=${sortConfig.direction}&search=${searchTerm}`
        );
        toast("Budget deleted successfully", { type: "success" });
      } else {
        console.error("Failed to delete budget");
      }
    } catch (error) {
      console.error("Error deleting budget", error);
    }
  };

  if (error) return <ErrorMessage message="Failed to fetch budget data." />;
  if (!data && isValidating) return <LoadingMessage />;
  if (sortedData.length === 0) return <NoDataMessage />;

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalBudget = sortedData.reduce(
    (acc, budget) => acc + budget.amount,
    0
  );
  const remainingBudget = totalBudget - totalExpenses;

  const years = [...new Set(data.data.map((budget) => budget.year))];

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="text-blue-500" />
    ) : (
      <FaSortDown className="text-blue-500" />
    );
  };

  return (
    <div className="pb-16 pt-6 px-16 flex flex-col container mx-auto mb-6 bg-slate-200 rounded-lg shadow-lg">
      <span className="text-2xl font-semibold mb-3 text-center">
        All Budgets
      </span>

      <BudgetProgressBar
        totalBudget={totalBudget}
        remainingBudget={remainingBudget}
      />

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          className="px-6 py-2 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Months</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="px-6 py-2 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {isValidating ? (
        <div className="flex justify-center items-center h-64">
          <AiOutlineLoading3Quarters className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("month")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Month</span>
                      <SortIcon column="month" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("year")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Year</span>
                      <SortIcon column="year" />
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
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((budget) => (
                  <tr key={budget._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {budget.month}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{budget.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {budget.amount.toFixed(2)} Tk
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleUpdate(budget)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit className="inline-block" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({ open: true, id: budget._id })
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
              disabled={page <= 1}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {data.pages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, data.pages))}
              className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
              disabled={page >= data.pages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedBudget ? "Update Budget" : "Add Budget"}
              </h3>
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedBudget(null);
                  }}
                  className="text-red-500 hover:text-red-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="mt-2 text-left py-3">
                <BudgetForm
                  budget={selectedBudget}
                  onClose={() => {
                    setIsModalOpen(false);
                    setSelectedBudget(null);
                    mutate(
                      `/api/budget?month=${filters.month}&year=${filters.year}&page=${page}&limit=${limit}&sortBy=${sortConfig.key}&sortOrder=${sortConfig.direction}&search=${searchTerm}`
                    );
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

function ErrorMessage({ message }) {
  return (
    <div className="container mx-auto p-4 mb-6 bg-red-100 text-red-700 rounded shadow-md">
      Error: {message}
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="container mx-auto p-4 mb-6 bg-gray-100 text-gray-700 rounded shadow-md">
      Loading...
    </div>
  );
}

function NoDataMessage() {
  return (
    <div className="container mx-auto p-4 mb-6 bg-yellow-100 text-yellow-700 rounded shadow-md">
      No budget data available.
    </div>
  );
}
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
