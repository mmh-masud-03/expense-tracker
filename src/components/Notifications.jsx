"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useBudget } from "@/utils/BudgetContext";
const Notification = () => {
  const { notification } = useBudget();

  const getIcon = (type) => {
    switch (type) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "loading":
        return "⏳";
      default:
        return "💡";
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "loading":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 max-w-md ${getColor(
            notification.type
          )} text-white p-4 rounded-lg shadow-lg flex items-center space-x-3`}
        >
          <div className="text-2xl">{getIcon(notification.type)}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">
              {notification.type.charAt(0).toUpperCase() +
                notification.type.slice(1)}
            </h3>
            <p>{notification.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
