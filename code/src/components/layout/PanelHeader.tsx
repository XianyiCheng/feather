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
    <div
      className={`flex items-center justify-between px-3 py-1.5 border-b flex-shrink-0 transition-colors ${
        active
          ? "bg-gray-800/60 border-gray-700"
          : "bg-gray-950 border-gray-800"
      }`}
    >
      <span
        className={`text-xs tracking-wide transition-colors ${
          active ? "text-gray-200 font-semibold" : "text-gray-500 font-medium"
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
