"use client";

import { useState, type ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const positionClasses: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowClasses: Record<string, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent",
  right: "right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent",
};

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute z-50 px-3 py-2 text-xs font-medium text-white bg-slate-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
}
