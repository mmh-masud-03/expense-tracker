"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import useSWR, { mutate } from "swr";
import {
  AiOutlineDollarCircle,
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BsFillCheckCircleFill, BsFilterLeft } from "react-icons/bs";
import {
  FaSortAmountDown,
  FaSortAmountUp,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import BudgetForm from "./BudgetForm"; // Make sure to import the BudgetForm component
import { toast } from "react-toastify";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("An error occurred while fetching the data.");
  return res.json();
};

export default function BudgetOverview() {
  const [filters, setFilters] = useState({ month: "", year: "" });
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const limit = 10;

  const { data, error, isValidating } = useSWR(
    `/api/budget?month=${filters.month}&year=${filters.year}&page=${page}&limit=${limit}`,
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

  const aggregateData = useCallback((data) => {
    return Object.values(
      data.reduce((acc, budget) => {
        const key = `${budget.month}-${budget.year}`;
        if (!acc[key]) {
          acc[key] = { ...budget, amount: 0 };
        }
        acc[key].amount += budget.amount;
        return acc;
      }, {})
    );
  }, []);

  const sortedData = useMemo(() => {
    if (!data) return [];
    const aggregatedData = aggregateData(data.data);
    if (sortConfig.key !== null) {
      return [...aggregatedData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return aggregatedData;
  }, [data, sortConfig, aggregateData]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
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
          `/api/budget?month=${filters.month}&year=${filters.year}&page=${page}&limit=${limit}`
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

  const months = [
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
  ];
  const years = [...new Set(data.data.map((budget) => budget.year))];

  return (
    <div className="p-6 mb-6 container mx-auto bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Budget Overview</h2>
      <BudgetSummary
        totalBudget={totalBudget}
        totalExpenses={totalExpenses}
        remainingBudget={remainingBudget}
      />
      <BudgetProgressBar
        totalBudget={totalBudget}
        remainingBudget={remainingBudget}
      />
      <BudgetDetails
        filters={filters}
        setFilters={setFilters}
        months={months}
        years={years}
        sortedData={sortedData}
        page={page}
        setPage={setPage}
        totalPages={data.pages}
        requestSort={requestSort}
        sortConfig={sortConfig}
        onUpdate={handleUpdate}
        handleDelete={handleDelete}
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
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
                      `/api/budget?month=${filters.month}&year=${filters.year}&page=${page}&limit=${limit}`
                    );
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

function ErrorMessage({ message }) {
  return (
    <div className="p-4 mb-6 bg-red-100 rounded-lg shadow-md flex items-center">
      <AiOutlineExclamationCircle className="text-red-500 w-6 h-6 mr-2" />
      <span>Error: {message}</span>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow-md flex items-center justify-center">
      <AiOutlineLoading3Quarters className="w-6 h-6 mr-2 animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

function NoDataMessage() {
  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow-md flex items-center">
      <AiOutlineExclamationCircle className="text-gray-500 w-6 h-6 mr-2" />
      <span>No budget data available</span>
    </div>
  );
}

function BudgetSummary({ totalBudget, totalExpenses, remainingBudget }) {
  const isOverBudget = remainingBudget < 0;
  const displayRemainingBudget = isOverBudget ? 0 : remainingBudget;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard
        title="Total Budget"
        amount={totalBudget}
        bgColor="bg-green-100"
        iconColor="text-green-500"
      />
      <SummaryCard
        title="Total Expenses"
        amount={totalExpenses}
        bgColor="bg-red-100"
        iconColor="text-red-500"
      />
      <SummaryCard
        title="Remaining Budget"
        amount={displayRemainingBudget}
        bgColor={isOverBudget ? "bg-red-100" : "bg-blue-100"}
        iconColor={isOverBudget ? "text-red-500" : "text-blue-500"}
        Icon={isOverBudget ? AiOutlineExclamationCircle : BsFillCheckCircleFill}
      />
      {isOverBudget && (
        <div className="col-span-1 md:col-span-3 p-4 bg-red-200 text-red-800 rounded-lg shadow-md mt-4">
          <AiOutlineExclamationCircle className="inline w-6 h-6 mr-2" />
          Warning: Expenses exceed the budget by{" "}
          {Math.abs(remainingBudget).toFixed(2)} TK.
        </div>
      )}
    </div>
  );
}

function BudgetProgressBar({ totalBudget, remainingBudget }) {
  const isOverBudget = remainingBudget < 0;
  const percentage =
    totalBudget > 0 ? Math.min((remainingBudget / totalBudget) * 100, 100) : 0;
  const progressColor = isOverBudget ? "bg-red-500" : "bg-blue-500";

  return (
    <div className="relative pt-1 mt-6">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span
            className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-${
              isOverBudget ? "red" : "blue"
            }-600 bg-${isOverBudget ? "red" : "blue"}-200`}
          >
            {isOverBudget ? "Over Budget" : "Remaining"}
          </span>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-semibold inline-block text-${
              isOverBudget ? "red" : "blue"
            }-600`}
          >
            {isOverBudget ? "0.00" : percentage.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
        <div
          style={{ width: `${percentage}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColor} transition-all duration-500 ease-in-out`}
        ></div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  amount,
  bgColor,
  iconColor,
  Icon = AiOutlineDollarCircle,
}) {
  return (
    <div
      className={`p-4 ${bgColor} rounded-lg shadow-sm flex items-center transition-all duration-300 hover:shadow-md`}
    >
      <Icon className={`${iconColor} w-10 h-10 mr-4`} />
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-2xl font-bold">BDT {amount.toFixed(2)}</p>
      </div>
    </div>
  );
}

function BudgetDetails({
  filters,
  setFilters,
  months,
  years,
  sortedData,
  page,
  setPage,
  totalPages,
  requestSort,
  sortConfig,
  onUpdate,
  handleDelete,
  confirmModal,
  setConfirmModal,
}) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Details</h3>
      <div className="mb-4 flex flex-wrap items-center space-x-4">
        <BsFilterLeft className="text-gray-500 w-6 h-6" />
        <select
          value={filters.month}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, month: e.target.value }))
          }
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={filters.year}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, year: e.target.value }))
          }
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <BudgetTable
        sortedData={sortedData}
        requestSort={requestSort}
        sortConfig={sortConfig}
        onUpdate={onUpdate}
        handleDelete={handleDelete}
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
      />
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

function BudgetTable({
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
                <FaSortAmountUp className="inline" />
              ) : (
                <FaSortAmountDown className="inline" />
              )}
            </th>
            <th
              className="py-3 px-4 uppercase text-sm text-left cursor-pointer hover:bg-gray-300"
              onClick={() => requestSort("year")}
            >
              Year{" "}
              {getClassNamesFor("year") === "ascending" ? (
                <FaSortAmountUp className="inline" />
              ) : (
                <FaSortAmountDown className="inline" />
              )}
            </th>
            <th
              className="py-3 px-4 uppercase text-sm text-left cursor-pointer hover:bg-gray-300"
              onClick={() => requestSort("amount")}
            >
              Amount{" "}
              {getClassNamesFor("amount") === "ascending" ? (
                <FaSortAmountUp className="inline" />
              ) : (
                <FaSortAmountDown className="inline" />
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

function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 rounded ${
          page === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        } transition-colors duration-200`}
      >
        Previous
      </button>
      <span className="px-4 py-2 bg-gray-100 rounded">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded ${
          page === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        } transition-colors duration-200`}
      >
        Next
      </button>
    </div>
  );
}
