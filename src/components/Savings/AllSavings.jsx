"use client";
import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import SavingsForm from "./SavingsForm";
import Modal from "./Modal";
import ProgressRing from "./ProgressRing";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AllSavings() {
  const { data, error, mutate } = useSWR("/api/savings?limit=100", fetcher);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddAmountOpen, setIsAddAmountOpen] = useState(false);

  if (error) return <div>Failed to load savings</div>;
  if (!data) return <div>Loading...</div>;

  const handleEdit = (saving) => {
    setSelectedSaving(saving);
    setIsFormOpen(true);
  };

  const handleAddAmount = (saving) => {
    setSelectedSaving(saving);
    setIsAddAmountOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/savings/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Savings deleted successfully", { type: "success" });
        mutate();
      } else {
        toast("Failed to delete savings", { type: "error" });
      }
    } catch (error) {
      toast("An unexpected error occurred", { type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setSelectedSaving(null);
          setIsFormOpen(true);
        }}
        className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        Add New Saving
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((saving) => {
          const percentage = Math.round(
            (saving.savedAmount / saving.goalAmount) * 100
          );
          return (
            <div
              key={saving._id}
              className="p-6 border rounded-lg shadow-md flex flex-col items-center space-y-4"
            >
              <ProgressRing percentage={percentage} />
              <div className="text-center">
                <h3 className="text-xl font-semibold">{saving.goalTitle}</h3>
                <p className="text-gray-600">
                  Goal: ${saving.goalAmount.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Saved: ${saving.savedAmount.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Target: {new Date(saving.targetDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(saving)}
                  className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleAddAmount(saving)}
                  className="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Add Amount
                </button>
                <button
                  onClick={() => handleDelete(saving._id)}
                  className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isFormOpen || isAddAmountOpen}
        onClose={() => {
          setIsFormOpen(false);
          setIsAddAmountOpen(false);
          setSelectedSaving(null);
        }}
      >
        <SavingsForm
          saving={selectedSaving}
          onClose={() => {
            setIsFormOpen(false);
            setIsAddAmountOpen(false);
            setSelectedSaving(null);
          }}
        />
      </Modal>
    </div>
  );
}
