import React from 'react';
import clsx from 'clsx';

export function Button({ children, className, variant = 'default', ...props }) {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
