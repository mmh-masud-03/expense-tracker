// app/income/edit/[id].js
import { useRouter } from "next/router";
import IncomeForm from "@/components/Income/IncomeForm";

export default function EditIncome() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <IncomeForm id={id} />
    </div>
  );
}
