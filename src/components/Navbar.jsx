"use client";
// components/Navbar.js
import Link from "next/link";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/expenses", label: "Expenses" },
    { href: "/income", label: "Income" },
    { href: "/budget", label: "Budget" },
    { href: "/reports", label: "Reports" },
  ];

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href={"/"} className="text-white font-bold text-xl">
                Expense Tracker
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-4 flex items-center">
              <Link
                href="/auth/login"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="ml-2 bg-white text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
