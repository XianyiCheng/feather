"use client";

import type { ReactNode } from "react";

export function PanelHeader({
  title,
  active,
  children,
}: {
  title: string;
  active: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-800 flex-shrink-0">
      <span
        className={`text-xs tracking-wide transition-colors ${
          active ? "text-gray-100 font-bold" : "text-gray-500 font-medium"
        }`}
      >
        {title}
      </span>
      {children && (
        <div className="flex items-center gap-3">{children}</div>
      )}
    </div>
  );
}
