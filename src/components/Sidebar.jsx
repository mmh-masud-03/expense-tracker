// components/Sidebar.js
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 font-bold text-xl">Expense Tracker</div>
      <nav className="flex flex-col p-4 space-y-4">
        <Link href="/dashboard" className="text-gray-300 hover:text-white">
          Dashboard
        </Link>
        <Link href="/expenses" className="text-gray-300 hover:text-white">
          Expenses
        </Link>
        <Link href="/income" className="text-gray-300 hover:text-white">
          Income
        </Link>
        <Link href="/budget" className="text-gray-300 hover:text-white">
          Budget
        </Link>
        <Link href="/reports" className="text-gray-300 hover:text-white">
          Reports
        </Link>
      </nav>
    </aside>
  );
}
