import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function ErrorMessage({ message }) {
  return (
    <div className="container mx-auto p-4 mb-6 bg-red-100 rounded-lg shadow-md flex items-center">
      <AiOutlineExclamationCircle className="text-red-500 w-6 h-6 mr-2" />
      <span>Error: {message}</span>
    </div>
  );
}
