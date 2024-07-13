import React from "react";

const HorizontalProgressBar = ({ percentage, color }) => {
  return (
    <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
      <div
        className="h-full"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default HorizontalProgressBar;
