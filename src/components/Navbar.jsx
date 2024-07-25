"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaChartBar,
  FaMoneyBillWave,
  FaWallet,
  FaChartLine,
  FaBell,
} from "react-icons/fa";
import { useBudget } from "@/utils/BudgetContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const { notification } = useBudget(); // Get notification from BudgetProvider

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: FaChartBar },
    { href: "/transactions", label: "Transactions", icon: FaMoneyBillWave },
    { href: "/reports", label: "Reports", icon: FaChartLine },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut();
    setDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center my-2 px-3">
            <Link href="/dashboard" className="flex items-center">
              <FaWallet className="inline-block text-slate-200 mr-2" />
              <span className="text-slate-200 font-bold text-xl">
                Expense Tracker
              </span>
            </Link>
          </div>

          {/* Centered Navigation Items */}
          <div className="hidden md:flex items-center justify-center flex-grow">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border border-slate-400 hover:bg-slate-900 hover:text-white px-3 py-2 rounded-md font-medium transition duration-150 ease-in-out flex items-center text-base mx-2 ${
                  pathname === item.href ? "bg-slate-100 text-black" : ""
                }`}
              >
                <item.icon className="mr-2" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="text-gray-100 hover:scale-105 focus:outline-none"
              >
                <FaBell className="h-6 w-6" size={12} />
                {notification?.type !== "empty" && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
              {notificationOpen && notification && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {notification.message}
                  </div>
                </div>
              )}
            </div>
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-slate-600 text-white p-2 rounded-full transition-colors duration-300 hover:bg-slate-500"
                >
                  <FaUser />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden absolute top-16 left-0 w-full bg-slate-800`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.href ? "bg-black text-white" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="inline-block mr-2" />
              {item.label}
            </Link>
          ))}
          {/* Notification in mobile menu */}
          <div className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="flex items-center w-full text-left"
            >
              <FaBell className="mr-2" />
              Notifications
              {notification && (
                <span className="ml-2 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
            {notificationOpen && notification && (
              <div className="mt-2 bg-slate-700 rounded-md p-2 text-sm">
                {notification.message}
              </div>
            )}
          </div>
          {session ? (
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
