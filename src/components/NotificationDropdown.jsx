import { useState, useEffect, useRef } from "react";
import { FaBell, FaTimes } from "react-icons/fa";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        throw new Error("Failed to fetch notifications");
      }
    } catch (error) {
      setError("Error fetching notifications");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    // Implement API call to mark notification as read
  };

  const dismissNotification = async (id) => {
    // Implement API call to dismiss notification
    setNotifications(notifications.filter((n) => n._id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black hover:bg-slate-200 p-2 rounded-full"
        aria-label="Notifications"
      >
        <FaBell />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1">
          {isLoading ? (
            <div className="px-4 py-2">Loading...</div>
          ) : error ? (
            <div className="px-4 py-2 text-red-500">{error}</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
              >
                <span>{notification.message}</span>
                <button
                  onClick={() => dismissNotification(notification._id)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Dismiss notification"
                >
                  <FaTimes />
                </button>
              </div>
            ))
          ) : (
            <div className="px-4 py-2">No new notifications</div>
          )}
        </div>
      )}
    </div>
  );
}
