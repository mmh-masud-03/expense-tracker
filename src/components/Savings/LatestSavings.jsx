"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LatestSavings() {
  const { data, error } = useSWR("/api/savings/recent", fetcher);

  if (error) return <div>Failed to load latest savings</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Latest Savings</h2>
      {data.data.map((saving) => (
        <div
          key={saving._id}
          className="p-4 border rounded-md flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-medium">{saving.goalTitle}</h3>
            <p>Goal Amount: {saving.goalAmount}</p>
            <p>Saved Amount: {saving.savedAmount}</p>
            <p>
              Target Date: {new Date(saving.targetDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
