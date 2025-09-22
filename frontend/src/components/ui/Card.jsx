import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-6 text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={`mt-1 text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);
