export default function ProgressRing({ percentage }) {
    const circumference = 2 * Math.PI * 45; // 45 is the radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
    return (
      <svg className="w-32 h-32" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className="text-blue-600"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <text
          x="50"
          y="50"
          fontFamily="Verdana"
          fontSize="20"
          textAnchor="middle"
          dy=".3em"
        >{`${percentage}%`}</text>
      </svg>
    );
  }