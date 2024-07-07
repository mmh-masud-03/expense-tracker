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
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Expense Tracker</h2>

      {/* Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md"
      >
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Financial Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="text-lg font-bold mb-2 text-gray-600">
              Total Expenses
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${overview.totalAmount.toFixed(2)}
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
              ${overview.averageAmount.toFixed(2)}
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
      <div className="mb-6 flex flex-wrap items-center space-x-4">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <AnimatePresence>
            {expenses.length > 0 ? (
              <motion.div layout className="space-y-4">
                {expenses.map((expense, index) => (
                  <motion.div
                    key={expense._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-white rounded-lg shadow-sm flex items-start space-x-4 border border-gray-200 hover:shadow-md transition ease-in-out duration-300"
                  >
                    <div className="flex-shrink-0">
                      <FaDollarSign className="text-green-500 text-3xl" />
                    </div>
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
                      ${expense.amount.toFixed(2)}
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
          </AnimatePresence>
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => currentPage > 1 && fetchExpenses(currentPage - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}