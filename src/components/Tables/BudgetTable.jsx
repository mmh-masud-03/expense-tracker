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
import BudgetForm from "../Budget/BudgetForm";
import { toast } from "react-toastify";
import BudgetProgressBar from "../Budget/BudgetProgressBar";
import BudgetDetails from "../Budget/BudgetDetails";
import ErrorMessage from "../Budget/ErrorMessage";
import LoadingMessage from "../Budget/LoadingMessage";
import NoDataMessage from "../Budget/NoDataMessage";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("An error occurred while fetching the data.");
  return res.json();
};

export default function BudgetTableWithoutOverview() {
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
  const toggleViewMode = () => setViewMode((prev) => !prev);
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
    <div className="r p-6 mb-6 container mx-auto bg-slate-100 rounded-lg shadow-lg transition-shadow hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Budget Overview</h2>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
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
