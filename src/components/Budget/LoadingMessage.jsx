export default function LoadingMessage() {
  return (
    <div className="container mx-auto p-4 mb-6 bg-white rounded-lg shadow-md flex items-center justify-center">
      <AiOutlineLoading3Quarters className="w-6 h-6 mr-2 animate-spin" />
      <span>Loading...</span>
    </div>
  );
}
