"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disable: boolean
}

export const Button = ({ children, onClick, disable }: ButtonProps,) => {
  return (
    <button disabled={disable} onClick={onClick} type="button" className="text-white cursor-pointer bg-gray-800 hover:bg-red-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
      {children}
    </button>
  );
};
