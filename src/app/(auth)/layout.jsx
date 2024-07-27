import { Open_Sans } from "next/font/google";
import "../globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Personal Finance Manager",
  description: "Manage your personal finances with ease and precision",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-block p-2 bg-white rounded-full shadow-lg mb-4">
                <Image
                  src="/favicon.ico"
                  alt="Personal Finance Manager Logo"
                  width={60}
                  height={60}
                />
              </div>
              <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md">
                Personal Finance Manager
              </h1>
              <p className="text-xl text-blue-100 drop-shadow mb-6">
                Your path to financial freedom
              </p>
              <div className="aspect-w-16 aspect-h-9 mb-6 flex justify-center xl:justify-start items-center">
                <iframe
                  width={440}
                  height={250}
                  src="https://www.youtube.com/embed/yYsWTdUOBVg?si=4FL5te7lRO2Xe-95"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
              <p className="text-blue-100 mb-4">
                Watch our overview video to learn more about our features!
              </p>
            </div>
            <div className="w-full lg:w-1/2 max-w-md">
              <main className="shadow-2xl rounded-2xl overflow-hidden">
                {children}
              </main>
            </div>
          </div>
          <footer className="mt-12 text-center text-sm text-blue-100">
            <p>© 2024 Personal Finance Manager. All rights reserved.</p>
            <div className="mt-2">
              <Link
                href="/privacy"
                className="text-blue-200 hover:text-white transition duration-300 mx-2"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-blue-200 hover:text-white transition duration-300 mx-2"
              >
                Terms of Service
              </Link>
            </div>
          </footer>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
