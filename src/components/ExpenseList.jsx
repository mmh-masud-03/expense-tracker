"use client";

import { useEffect, useState } from "react";
import { GetAllExpenses } from "@/utils/helper";
import { FaDollarSign, FaCalendarDay, FaTag } from "react-icons/fa";

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

  const fetchExpenses = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/expenses?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&limit=10`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const { expenses, totalPages } = await res.json();
      setExpenses(expenses);
      setTotalPages(totalPages);
      setCurrentPage(page);

      // Calculate overview statistics
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

      setOverview({
        totalAmount,
        averageAmount,
        categoryCounts,
      });
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(currentPage);
  }, [sortBy, sortOrder, currentPage]);

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Expenses</h2>

      {/* Overview Section */}
      <div className="mb-6 p-4 bg-blue-100 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Overview</h3>
        <div className="flex justify-between text-gray-700">
          <div>
            <div className="text-lg font-bold mb-1">Total Amount</div>
            <div className="text-xl text-green-700">
              ${overview.totalAmount.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold mb-1">Average Amount</div>
            <div className="text-xl text-blue-700">
              ${overview.averageAmount.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold mb-1">Categories</div>
            <ul>
              {Object.entries(overview.categoryCounts).map(
                ([category, count]) => (
                  <li key={category} className="text-gray-600">
                    {category}: {count}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Sorting Buttons */}
      <div className="mb-4 flex items-center space-x-4">
        <button
          onClick={() => setSortBy("date")}
          className={`px-4 py-2 rounded-md ${
            sortBy === "date"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Sort by Date
        </button>
        <button
          onClick={() => setSortBy("amount")}
          className={`px-4 py-2 rounded-md ${
            sortBy === "amount"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Sort by Amount
        </button>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700"
        >
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {/* Expenses List */}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          {expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg shadow-md flex items-start space-x-4 border border-gray-200 hover:bg-gray-100 transition ease-in-out duration-300"
                >
                  <div className="flex-shrink-0">
                    <FaDollarSign className="text-green-600 text-3xl" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold text-lg mb-1">
                      {expense.title}
                    </div>
                    <div className="text-gray-600 flex items-center space-x-2 mb-1">
                      <FaTag className="text-gray-500" />
                      <span>{expense.category}</span>
                    </div>
                    <div className="text-gray-600 flex items-center space-x-2">
                      <FaCalendarDay className="text-gray-500" />
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="font-bold text-lg text-gray-800">
                    ${expense.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No expenses found</div>
          )}
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => currentPage > 1 && fetchExpenses(currentPage - 1)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            <span className="self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                currentPage < totalPages && fetchExpenses(currentPage + 1)
              }
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
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
