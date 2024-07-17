"use client";
import { useState, useEffect } from "react";

export default function ImprovedDatePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) {
  const [isStartFocused, setIsStartFocused] = useState(false);
  const [isEndFocused, setIsEndFocused] = useState(false);

  useEffect(() => {
    if (new Date(startDate) > new Date(endDate)) {
      setEndDate(startDate);
    }
  }, [startDate, endDate, setEndDate]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const getQuickDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  return (
    <div className=" bg-slate-50 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Select Date Range
      </h3>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="w-full sm:w-1/2">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date
          </label>
          <div
            className={`relative ${
              isStartFocused ? "ring-2 ring-green-500 rounded-md" : ""
            }`}
          >
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              onFocus={() => setIsStartFocused(true)}
              onBlur={() => setIsStartFocused(false)}
              max={endDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500 appearance-none transition-all duration-200"
            />
            <svg
              className="absolute animate-pulse right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date
          </label>
          <div
            className={`relative ${
              isEndFocused ? "ring-2 ring-green-500 rounded-md" : ""
            }`}
          >
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              onFocus={() => setIsEndFocused(true)}
              onBlur={() => setIsEndFocused(false)}
              min={startDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500 appearance-none transition-all duration-200"
            />
            <svg
              className="absolute animate-pulse cursor-pointer right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => getQuickDateRange(7)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
        >
          Last 7 days
        </button>
        <button
          onClick={() => getQuickDateRange(30)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
        >
          Last 30 days
        </button>
        <button
          onClick={() => getQuickDateRange(90)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
        >
          Last 90 days
        </button>
      </div>
    </div>
  );
}
