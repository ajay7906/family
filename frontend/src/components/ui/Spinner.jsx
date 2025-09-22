import React from "react";

export const Spinner = ({ size = "w-12 h-12", color = "border-blue-500" }) => {
  return (
    <div
      className={`${size} border-4 ${color} border-t-transparent rounded-full animate-spin`}
    ></div>
  );
};
