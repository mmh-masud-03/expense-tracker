"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaChartPie,
  FaMoneyBillWave,
  FaWallet,
  FaChartBar,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: FaChartPie },
    { href: "/expenses", label: "Expenses", icon: FaMoneyBillWave },
    { href: "/income", label: "Income", icon: FaWallet },
    { href: "/budget", label: "Budget", icon: FaChartBar },
    { href: "/reports", label: "Reports", icon: FaFileAlt },
  ];

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed z-20 top-4 left-4 p-2 bg-gray-800 text-white rounded-full shadow-lg"
        aria-label="Toggle Menu"
      >
        <FaChevronRight
          className={`w-6 h-6 transition-transform duration-300 ${
            isMobileOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <aside
        className={`${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-10 bg-gray-800 text-white transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        } flex flex-col`}
      >
        <div
          className={`p-4 font-bold text-xl flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && <span>Expense Tracker</span>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-gray-700 lg:block hidden"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              <FaChevronRight className="w-5 h-5" />
            ) : (
              <FaChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150 ease-in-out ${
                isCollapsed ? "justify-center py-4" : "px-4 py-3"
              }`}
            >
              <item.icon className={`w-6 h-6 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
