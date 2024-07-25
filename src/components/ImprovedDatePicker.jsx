import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ImprovedDatePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) {
  const [localStartDate, setLocalStartDate] = useState(
    startDate ? new Date(startDate) : null
  );
  const [localEndDate, setLocalEndDate] = useState(
    endDate ? new Date(endDate) : null
  );

  useEffect(() => {
    if (localStartDate && localEndDate && localStartDate > localEndDate) {
      setLocalEndDate(localStartDate);
    }
  }, [localStartDate, localEndDate]);

  useEffect(() => {
    if (localStartDate) {
      setStartDate(localStartDate.toISOString().split("T")[0]);
    }
    if (localEndDate) {
      setEndDate(localEndDate.toISOString().split("T")[0]);
    }
  }, [localStartDate, localEndDate, setStartDate, setEndDate]);

  const getQuickDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setLocalStartDate(start);
    setLocalEndDate(end);
  };

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-md">
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
          <DatePicker
            selected={localStartDate}
            onChange={(date) => setLocalStartDate(date)}
            selectsStart
            startDate={localStartDate}
            endDate={localEndDate}
            maxDate={localEndDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500 appearance-none transition-all duration-200"
          />
        </div>
        <div className="w-full sm:w-1/2">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date
          </label>
          <DatePicker
            selected={localEndDate}
            onChange={(date) => setLocalEndDate(date)}
            selectsEnd
            startDate={localStartDate}
            endDate={localEndDate}
            minDate={localStartDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500 appearance-none transition-all duration-200"
          />
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
