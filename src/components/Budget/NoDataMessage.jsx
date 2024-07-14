export default function NoDataMessage() {
  return (
    <div className="container mx-auto p-4 mb-6 bg-white rounded-lg shadow-md flex items-center">
      <AiOutlineExclamationCircle className="text-gray-500 w-6 h-6 mr-2" />
      <span>No budget data available</span>
    </div>
  );
}
