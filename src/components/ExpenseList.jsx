"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FaDollarSign,
  FaCalendarDay,
  FaTag,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import ExpenseForm from "./ExpenseForm";
import { toast } from "react-toastify";
export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const [overview, setOverview] = useState({
    totalAmount: 0,
    averageAmount: 0,
    categoryCounts: {},
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchExpenses = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/expenses?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&limit=10&search=${searchTerm}&category=${filterCategory}`
      );
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const { expenses, totalPages } = await res.json();
      setExpenses(expenses);
      setTotalPages(totalPages);
      setCurrentPage(page);

      const totalAmount = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const averageAmount =
        expenses.length > 0 ? totalAmount / expenses.length : 0;
      const categoryCounts = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + 1;
        return acc;
      }, {});

      setOverview({ totalAmount, averageAmount, categoryCounts });
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(currentPage);
  }, [sortBy, sortOrder, currentPage, searchTerm, filterCategory]);

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
  const handleUpdate = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast("Expense deleted successfully", { type: "success" });
        setConfirmModal({ open: false, id: null });
        fetchExpenses(currentPage);
      } else {
        console.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };
  function ConfirmDeleteModal({ onConfirm, onCancel }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md">
          <p>Are you sure you want to delete this expense?</p>
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
    <div className="p-6 mb-6 bg-slate-100 rounded-lg shadow-lg container mx-auto">
      {/* Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md"
      >
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Expenses Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="text-lg font-bold mb-2 text-gray-600">
              Total Expenses
            </div>
            <div className="text-3xl font-bold text-green-600">
              BDT {overview.totalAmount.toFixed(2)}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="text-lg font-bold mb-2 text-gray-600">
              Average Expense
            </div>
            <div className="text-3xl font-bold text-blue-600">
              BDT {overview.averageAmount.toFixed(2)}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="text-lg font-bold mb-2 text-gray-600">
              Top Categories
            </div>
            <ul className="space-y-2">
              {Object.entries(overview.categoryCounts)
                .slice(0, 3)
                .map(([category, count]) => (
                  <li
                    key={category}
                    className="text-gray-600 flex justify-between"
                  >
                    <span>{category}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search expenses..."
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
      {/* Sorting Buttons */}
      <div className="mb-6 flex flex-wrap items-center space-x-4">
        <h3 className="text-lg font-semibold mb-2 ">Sort by:</h3>
        <button
          onClick={() => handleSort("date")}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-300 flex items-center space-x-2"
        >
          <span>Date</span>
          <SortIcon column="date" />
        </button>
        <button
          onClick={() => handleSort("amount")}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-300 flex items-center space-x-2"
        >
          <span>Amount</span>
          <SortIcon column="amount" />
        </button>
      </div>

      {/* Expenses List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <AiOutlineLoading3Quarters className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* <AnimatePresence>
            {expenses.length > 0 ? (
              <motion.div layout className="space-y-4">
                {expenses.map((expense, index) => (
                  <motion.div
                    key={expense._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-white rounded-lg shadow-sm flex items-center lg:items-start space-x-4 border border-gray-200 hover:shadow-md transition ease-in-out duration-300"
                  >
                    <div className="flex-grow">
                      <div className="font-semibold text-lg mb-1 text-gray-800">
                        {expense.title}
                      </div>
                      <div className="text-gray-600 flex items-center space-x-2 mb-1">
                        <FaTag className="text-gray-400" />
                        <span>{expense.category}</span>
                      </div>
                      <div className="text-gray-600 flex items-center space-x-2">
                        <FaCalendarDay className="text-gray-400" />
                        <span>
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="font-bold text-lg text-gray-800">
                      {expense.amount.toFixed(2)} Tk
                    </div>
                    <div className="flex-shrink-0 ml-4 space-x-2">
                      <button
                        onClick={() => handleUpdate(expense)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          setConfirmModal({ open: true, id: expense._id })
                        }
                      >
                        <FaTrash />
                      </button>
                      {confirmModal.open && confirmModal.id === expense._id && (
                        <ConfirmDeleteModal
                          onConfirm={() => handleDelete(confirmModal.id)}
                          onCancel={() =>
                            setConfirmModal({ open: false, id: null })
                          }
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-500 text-center py-8"
              >
                No expenses found
              </motion.div>
            )}
          </AnimatePresence> */}
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
                  {expenses.length > 0 ? (
                    expenses.map((expense, index) => (
                      <motion.tr
                        key={expense._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {expense.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {expense.amount.toFixed(2)} Tk
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleUpdate(expense)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <FaEdit className="inline-block" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmModal({ open: true, id: expense._id })
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
                        No expenses found
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {confirmModal.open && (
            <ConfirmDeleteModal
              onConfirm={() => handleDelete(confirmModal.id)}
              onCancel={() => setConfirmModal({ open: false, id: null })}
            />
          )}
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => currentPage > 1 && fetchExpenses(currentPage - 1)}
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
                currentPage < totalPages && fetchExpenses(currentPage + 1)
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-lg bg-white">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              {selectedExpense ? "Update Expense" : "Add Expense"}
            </h3>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedExpense(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <ExpenseForm
              expense={selectedExpense}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedExpense(null);
                fetchExpenses(currentPage);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
