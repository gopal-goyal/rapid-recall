import React from 'react';
import clsx from 'clsx';

export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        className
      )}
      {...props}
    />
  );
}
