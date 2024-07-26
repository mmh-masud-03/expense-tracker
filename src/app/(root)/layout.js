import { Inter, Open_Sans } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AddFinanceButton from "@/components/AddFinanceButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "@/utils/AuthProvider";
import { BudgetProvider } from "@/utils/BudgetContext";
const opensans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "FinTrack",
  description: "Track your finances with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={opensans.className}>
        <AuthProvider>
          <BudgetProvider>
            <div className="min-h-screen bg-gray-900">
              <Navbar />
              <div className="flex pt-16">
                {" "}
                {/* Added pt-16 for Navbar height */}
                <Sidebar />
                <div className="flex-1 lg:ml-20">
                  {" "}
                  {/* Added lg:ml-20 for collapsed sidebar width */}
                  <main className="px-5 py-3">
                    {children}
                    <div className="container mx-auto">
                      <AddFinanceButton />
                    </div>
                    <ToastContainer />
                  </main>
                </div>
              </div>
            </div>
          </BudgetProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
