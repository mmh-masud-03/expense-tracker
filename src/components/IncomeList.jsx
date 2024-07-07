"use client";

import { useEffect, useState } from "react";
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
  }, [currentPage]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Income</h2>
      <OverviewSection overview={overview} />
      <IncomeListSection incomes={incomes} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchIncome}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-4 mb-6 bg-white rounded shadow-md flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Loading...</span>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="p-4 mb-6 bg-red-100 text-red-700 rounded shadow-md">
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

function IncomeListSection({ incomes }) {
  if (incomes.length === 0) {
    return <div className="text-gray-500">No income found</div>;
  }

  return (
    <div className="space-y-4">
      {incomes.map((income, index) => (
        <IncomeItem key={index} income={income} />
      ))}
    </div>
  );
}

function IncomeItem({ income }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md flex items-start space-x-4 border border-gray-200 hover:bg-gray-100 transition ease-in-out duration-300">
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
        BDT {income.amount.toFixed(2)}
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
