"use client";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { getUserId } from "@/utils/UtilityFunction";

export default function SavingsForm({ saving, onClose }) {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [amountToAdd, setAmountToAdd] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");
  const userId = getUserId();

  useEffect(() => {
    if (saving) {
      setGoalTitle(saving.goalTitle);
      setGoalAmount(saving.goalAmount);
      setSavedAmount(saving.savedAmount);
      setTargetDate(new Date(saving.targetDate).toISOString().split("T")[0]);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setTargetDate(today);
    }
  }, [saving]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      user: userId,
      goalTitle,
      goalAmount,
      savedAmount,
      targetDate,
    };

    const url = saving ? `/api/savings/${saving._id}` : "/api/savings/create";
    const method = saving ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onClose();
        toast(saving ? "Savings Updated" : "Savings Created", {
          type: "success",
        });
        mutate("/api/savings?limit=100");
      } else {
        const errorData = await res.json();
        setError(errorData.error);
        console.error("Error processing savings");
      }
    } catch (error) {
      console.error("Error processing savings", error);
      setError("An unexpected error occurred");
    }
  };

  const handleAddAmount = async (e) => {
    e.preventDefault();

    const url = `/api/savings/add/${saving._id}`;
    const data = { amountToAdd: parseFloat(amountToAdd) };

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onClose();
        toast("Amount added to savings", { type: "success" });
        mutate("/api/savings?limit=100");
      } else {
        const errorData = await res.json();
        setError(errorData.error);
        console.error("Error adding amount to savings");
      }
    } catch (error) {
      console.error("Error adding amount to savings", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 w-full px-4">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        <label
          htmlFor="goalTitle"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Goal Title
        </label>
        <input
          type="text"
          name="goalTitle"
          id="goalTitle"
          placeholder="Enter goal title"
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
          className="mt-1 h-8 pl-7 pr-12 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base outline-none border-b-2 border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="goalAmount"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Goal Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            name="goalAmount"
            id="goalAmount"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="h-8 focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 text-base outline-none border-b-2 border-gray-300 rounded-md"
            placeholder="Enter goal amount"
            required
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="savedAmount"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Saved Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            name="savedAmount"
            id="savedAmount"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
            className="h-8 focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 text-base outline-none border-b-2 border-gray-300 rounded-md"
            placeholder="Enter saved amount"
            required
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="targetDate"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Target Date
        </label>
        <input
          type="date"
          name="targetDate"
          id="targetDate"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="mt-1 pl-7 h-8 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base outline-none border-b-2 border-gray-300 rounded-md"
          required
        />
      </div>
      {saving && (
        <div>
          <label
            htmlFor="amountToAdd"
            className="block text-base font-medium text-gray-700 mb-1"
          >
            Amount to Add
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="amountToAdd"
              id="amountToAdd"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              className="h-8 focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 text-base outline-none border-b-2 border-gray-300 rounded-md"
              placeholder="Enter amount to add"
            />
          </div>
        </div>
      )}
      <div className="pt-2 flex justify-between">
        <button
          type="submit"
          className="flex-1 mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          {saving ? "Update Savings" : "Add Savings"}
        </button>
        {saving && (
          <button
            type="button"
            onClick={handleAddAmount}
            className="flex-1 mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            Add Amount
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="flex-1 ml-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
