"use client";

import { useEffect, useState } from "react";
import { GetAllIncome } from "@/utils/helper";
import { FaDollarSign, FaCalendarDay, FaTag } from "react-icons/fa";

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

  const fetchIncome = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/income?page=${page}&limit=10`);
      if (!res.ok) {
        throw new Error("Failed to fetch income data");
      }
      const { incomes, totalPages, totalAmount } = await res.json();
      setIncomes(incomes);

      // Calculate overview statistics
      const averageAmount =
        incomes.length > 0 ? totalAmount / incomes.length : 0;

      setOverview({
        totalAmount,
        averageAmount,
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
  }, [currentPage]);

  if (loading) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">Error: {error}</div>
    );
  }

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Income</h2>

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
        </div>
      </div>

      {/* Income List */}
      {incomes.length > 0 ? (
        <div className="space-y-4">
          {incomes.map((income, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg shadow-md flex items-start space-x-4 border border-gray-200 hover:bg-gray-100 transition ease-in-out duration-300"
            >
              <div className="flex-shrink-0">
                <FaDollarSign className="text-green-600 text-3xl" />
              </div>
              <div className="flex-grow">
                <div className="font-semibold text-lg mb-1">{income.title}</div>
                <div className="text-gray-600 flex items-center space-x-2 mb-1">
                  <FaTag className="text-gray-500" />
                  <span>{income.category}</span>
                </div>
                <div className="text-gray-600 flex items-center space-x-2">
                  <FaCalendarDay className="text-gray-500" />
                  <span>{new Date(income.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="font-bold text-lg text-gray-800">
                ${income.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No income found</div>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => currentPage > 1 && fetchIncome(currentPage - 1)}
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
            currentPage < totalPages && fetchIncome(currentPage + 1)
          }
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
