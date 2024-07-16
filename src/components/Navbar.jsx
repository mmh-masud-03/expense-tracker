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
} from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";
import SettingsDropdown from "./SettingsDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed w-full z-10 bg-slate-100 text-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center my-2 px-3">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-black font-bold text-xl">
                <FaWallet className="inline-block mr-2" /> Expense Tracker
              </span>
            </Link>
          </div>

          {/* Centered Navigation Items */}
          <div className="hidden md:flex items-center justify-center flex-grow">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-black border border-slate-400 hover:bg-slate-900 hover:text-white px-3 py-2 rounded-md font-medium transition duration-150 ease-in-out flex items-center text-base mx-2 ${
                  pathname === item.href ? "bg-slate-900 text-white" : ""
                }`}
              >
                <item.icon className="mr-2" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <NotificationDropdown />
            <SettingsDropdown />
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
                      onClick={() => {
                        signOut();
                        setDropdownOpen(false);
                      }}
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
              aria-expanded="false"
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
          <div className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            <NotificationDropdown />
          </div>
          <div className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            <SettingsDropdown />
          </div>
          {session ? (
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
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
