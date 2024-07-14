export default function SummaryCard({
  title,
  amount,
  bgColor,
  iconColor,
  Icon = AiOutlineDollarCircle,
}) {
  return (
    <div
      className={`p-4 ${bgColor} rounded-lg shadow-sm flex items-center transition-all duration-300 hover:shadow-md`}
    >
      <Icon className={`${iconColor} w-10 h-10 mr-4`} />
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-2xl font-bold">BDT {amount.toFixed(2)}</p>
      </div>
    </div>
  );
}
