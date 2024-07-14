"use client";
import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import SavingsForm from "./SavingsForm";
import Modal from "./Modal";
import HorizontalProgressBar from "./HorizontalProgressBar";
import { FiInfo, FiPlusCircle } from "react-icons/fi";
import {
  FaLaptop,
  FaMobileAlt,
  FaPlane,
  FaCar,
  FaHome,
  FaGraduationCap,
  FaPiggyBank,
} from "react-icons/fa";

const fetcher = (url) => fetch(url).then((res) => res.json());

// Define a mapping of keywords to icons and colors
const categoryMap = {
  laptop: { icon: FaLaptop, color: "purple" },
  phone: { icon: FaMobileAlt, color: "green" },
  travel: { icon: FaPlane, color: "blue" },
  car: { icon: FaCar, color: "red" },
  home: { icon: FaHome, color: "orange" },
  education: { icon: FaGraduationCap, color: "pink" },
  default: { icon: FaPiggyBank, color: "gray" },
};

export default function AllSavings() {
  const { data, error, mutate } = useSWR("/api/savings?limit=100", fetcher);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddAmountOpen, setIsAddAmountOpen] = useState(false);

  if (error) return <div>Failed to load savings</div>;
  if (!data) return <div>Loading...</div>;

  const handleAddAmount = (saving) => {
    setSelectedSaving(saving);
    setIsAddAmountOpen(true);
  };
  const handleEdit = (saving) => {
    setSelectedSaving(saving);
    setIsFormOpen(true);
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

  const getCategoryInfo = (goalTitle) => {
    const lowercaseTitle = goalTitle.toLowerCase();
    for (const [keyword, info] of Object.entries(categoryMap)) {
      if (lowercaseTitle.includes(keyword)) {
        return info;
      }
    }
    return categoryMap.default;
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-2">Savings plan</h2>
      <p className="text-lg mb-4">{data.data.length} saving plans</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {data.data.map((saving) => {
          const percentage = Math.round(
            (saving.savedAmount / saving.goalAmount) * 100
          );
          const { icon: Icon, color } = getCategoryInfo(saving.goalTitle);

          return (
            <div
              key={saving._id}
              className="border rounded-lg p-4 relative group"
            >
              <div className="flex items-center mb-2">
                <div
                  className={`bg-${color}-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2`}
                >
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold">{saving.goalTitle}</h3>
              </div>
              <p className="text-green-600 font-semibold">
                Tk {saving.savedAmount.toLocaleString()} / Tk{" "}
                {saving.goalAmount.toLocaleString()}
              </p>
              <HorizontalProgressBar percentage={percentage} color={color} />
              <button
                onClick={() => handleAddAmount(saving)}
                className="absolute top-2 right-2 rounded-full p-1"
              >
                <FiInfo size={15} />
              </button>
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
