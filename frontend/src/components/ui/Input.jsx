import React, { forwardRef } from "react";

export const Input = forwardRef(
  ({ label, id, error, prefix, className = "", ...props }, ref) => {
    const hasError = !!error;

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">{prefix}</span>
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`
              block w-full px-3 py-2 border rounded-md shadow-sm 
              ${prefix ? "pl-10" : ""}
              ${
                hasError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              }
              placeholder-gray-400 focus:outline-none sm:text-sm ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
