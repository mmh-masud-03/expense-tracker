export default function Pagination({ page, setPage, totalPages }) {
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
