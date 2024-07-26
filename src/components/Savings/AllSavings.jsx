"use client";
import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import SavingsForm from "./SavingsForm";
import Modal from "./Modal";
import HorizontalProgressBar from "./HorizontalProgressBar";
import { FiMoreVertical } from "react-icons/fi";
import {
  FaLaptop,
  FaMobileAlt,
  FaPlane,
  FaCar,
  FaHome,
  FaGraduationCap,
  FaPiggyBank,
} from "react-icons/fa";
import LoadingMessage from "../Budget/LoadingMessage";

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
  const { data, error, mutate } = useSWR("/api/savings?limit=2", fetcher);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddAmountOpen, setIsAddAmountOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (error) return <div>Failed to load savings</div>;
  if (!data)
    return (
      <div>
        <LoadingMessage />
      </div>
    );

  const handleAddAmount = (saving) => {
    setSelectedSaving(saving);
    setIsAddAmountOpen(true);
  };

  const handleEdit = (saving) => {
    setSelectedSaving(saving);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (saving) => {
    setSelectedSaving(saving);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSaving) return;

    try {
      const res = await fetch(`/api/savings/${selectedSaving._id}`, {
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
    setIsDeleteConfirmOpen(false);
    setSelectedSaving(null);
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
    <div className="relative bg-gradient-to-r from-slate-50  to-slate-200 p-1 rounded-lg shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-2">Savings plan</h2>
      <p className="text-lg mb-4">{data.data.length} saving plans</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {data.data.map((saving) => {
          const percentage = Math.round(
            (saving.savedAmount / saving.goalAmount) * 100
          );
          const { icon: Icon, color } = getCategoryInfo(saving.goalTitle);

          return (
            <div
              key={saving._id}
              className="border bg-slate-50 rounded-lg p-4 relative group"
            >
              <div className="flex items-center mb-2">
                <div
                  className={`bg-${color}-500 text-blue-500 rounded-full w-8 h-8 flex items-center justify-center mr-2`}
                >
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold">{saving.goalTitle}</h3>
              </div>
              <p className="text-green-600 text-base font-semibold">
                Tk {saving.savedAmount.toLocaleString()} / Tk{" "}
                {saving.goalAmount.toLocaleString()}
              </p>
              <HorizontalProgressBar percentage={percentage} color={color} />
              <div className="absolute top-2 right-2">
                <div className="relative">
                  <button
                    onClick={() => setSelectedSaving(saving)}
                    className="rounded-full p-1"
                  >
                    <FiMoreVertical size={15} />
                  </button>
                  {selectedSaving === saving && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleAddAmount(saving)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Add Amount
                      </button>
                      <button
                        onClick={() => handleEdit(saving)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(saving)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
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

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedSaving(null);
        }}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this savings plan?</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
