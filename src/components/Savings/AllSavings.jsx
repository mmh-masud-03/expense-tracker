"use client";
import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import SavingsForm from "./SavingsForm";
import Modal from "./Modal";
import HorizontalProgressBar from "./HorizontalProgressBar";
import { FiInfo } from "react-icons/fi";

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
    <div className="relative bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-2">Savings plan</h2>
      <p className="text-lg mb-4">{data.data.length} saving plans</p>
      {/* <a href="#" className="text-purple-600 mb-6 inline-block">
        See more detail Here ↗
      </a> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {data.data.map((saving) => {
          const percentage = Math.round(
            (saving.savedAmount / saving.goalAmount) * 100
          );
          const getColor = (title) => {
            if (title.toLowerCase().includes("laptop")) return "bg-purple-500";
            if (title.toLowerCase().includes("iphone")) return "bg-green-500";
            return "bg-yellow-500";
          };
          const getIcon = (title) => {
            if (title.toLowerCase().includes("laptop")) return "♫";
            if (title.toLowerCase().includes("iphone")) return "☪";
            return "📱";
          };
          return (
            <div key={saving._id} className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div
                  className={`${getColor(
                    saving.goalTitle
                  )} text-white rounded-full w-8 h-8 flex items-center justify-center mr-2`}
                >
                  {getIcon(saving.goalTitle)}
                </div>
                <h3 className="text-lg font-semibold">{saving.goalTitle}</h3>
              </div>
              <p className="text-green-600 font-semibold">
                ${saving.savedAmount.toLocaleString()} / $
                {saving.goalAmount.toLocaleString()}
              </p>
              <HorizontalProgressBar
                percentage={percentage}
                color={getColor(saving.goalTitle).split("-")[1]}
              />
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
      <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
        <FiInfo size={24} />
      </button>
    </div>
  );
}
