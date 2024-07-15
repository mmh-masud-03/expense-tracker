import { BsFilterLeft } from "react-icons/bs";
import BudgetTable from "./BudgetTable";
import Pagination from "./Pagination";

export default function BudgetDetails({
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
