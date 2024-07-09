"use client";

import { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaCalendarDay,
  FaTag,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import IncomeForm from "./IncomeForm";

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

  const handleUpdate = (income) => {
    setSelectedIncome(income);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        const res = await fetch(`/api/income/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchIncome(currentPage);
        } else {
          setError("Failed to delete income");
        }
      } catch (error) {
        setError("Error deleting income");
      }
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Income</h2>
      <OverviewSection overview={overview} />
      <IncomeListSection
        incomes={incomes}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchIncome}
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedIncome ? "Update Income" : "Add Income"}
              </h3>
              <div className="mt-2 px-7 py-3">
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

function IncomeListSection({ incomes, onUpdate, onDelete }) {
  if (incomes.length === 0) {
    return <div className="text-gray-500">No income found</div>;
  }

  return (
    <div className="space-y-4">
      {incomes.map((income) => (
        <IncomeItem
          key={income._id}
          income={income}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function IncomeItem({ income, onUpdate, onDelete }) {
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
        {income.amount.toFixed(2)} Tk
      </div>
      <div className="flex-shrink-0 ml-4 space-x-2">
        <button
          onClick={() => onUpdate(income)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(income._id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
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
