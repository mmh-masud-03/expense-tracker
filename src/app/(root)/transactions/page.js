import dynamic from "next/dynamic";
import { Suspense } from "react";

const AllTransactionsDetailsPage = dynamic(
  () => import("@/components/All Transactions/AllTransactionsDetailsPage"),
  {
    loading: () => <p>Loading transactions...</p>,
  }
);
const TableNav = dynamic(() => import("@/components/Tables/TableNav"), {
  loading: () => <p>Loading tables...</p>,
});

export default function Home() {
  return (
    <div className="container mx-auto bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<p>Loading transactions...</p>}>
        <AllTransactionsDetailsPage />
      </Suspense>
      <Suspense fallback={<p>Loading tables...</p>}>
        <TableNav />
      </Suspense>
    </div>
  );
}
