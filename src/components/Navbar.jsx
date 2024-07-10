"use client";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { getUserId } from "@/utils/UtilityFunction";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const userId = getUserId();
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/expenses", label: "Expenses", icon: "💸" },
    { href: "/income", label: "Income", icon: "💰" },
    { href: "/budget", label: "Budget", icon: "📅" },
    { href: "/reports", label: "Reports", icon: "📈" },
  ];

  return (
    <nav className="fixed w-full z-10 transition-all duration-300 bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-white font-bold text-xl">
                💼 Expense Tracker
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-white hover:bg-blue-700 px-3 py-2 rounded-md font-medium transition duration-150 ease-in-out flex items-center text-base ${
                  pathname === item.href ? "bg-blue-700" : ""
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="ml-4 flex items-center space-x-2">
              {session ? (
                <>
                  <button
                    onClick={() => signOut()}
                    className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                  >
                    Logout
                  </button>
                  {session?.user && (
                    <Link
                      href={`/profile.${session?.user?._id}`}
                      className="text-white p-1 border-2 rounded-lg"
                    >
                      {session?.user?.name}
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden absolute top-16 left-0 w-full bg-blue-600`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.href ? "bg-blue-700" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
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
