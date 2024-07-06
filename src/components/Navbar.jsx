// components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Expense Tracker</div>
        <div className="flex space-x-4">
          <Link href="/dashboard" className="text-white">
            Dashboard
          </Link>
          <Link href="/expenses" className="text-white">
            Expenses
          </Link>
          <Link href="/income" className="text-white">
            Income
          </Link>
          <Link href="/budget" className="text-white">
            Budget
          </Link>
          <Link href="/reports" className="text-white">
            Reports
          </Link>
          <Link href="/auth/login" className="text-white">
            Login
          </Link>
          <Link href="/auth/register" className="text-white">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
