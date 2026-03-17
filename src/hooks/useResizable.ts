"use client";

import { useCallback, useRef, useState } from "react";

interface UseResizableOptions {
  direction: "horizontal" | "vertical";
  initialSizes: number[]; // percentages, must sum to 100
  minSizes?: number[];    // minimum percentages
  storageKey?: string;
}

export function useResizable({
  direction,
  initialSizes,
  minSizes,
  storageKey,
}: UseResizableOptions) {
  const mins = minSizes || initialSizes.map(() => 5);

  function loadSizes(): number[] {
    if (storageKey && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`resize-${storageKey}`);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initialSizes;
  }

  const [sizes, setSizesState] = useState<number[]>(loadSizes);
  const containerRef = useRef<HTMLDivElement>(null);

  function saveSizes(newSizes: number[]) {
    setSizesState(newSizes);
    if (storageKey && typeof window !== "undefined") {
      try {
        localStorage.setItem(`resize-${storageKey}`, JSON.stringify(newSizes));
      } catch {}
    }
  }

  const onDragStart = useCallback(
    (separatorIndex: number) => {
      return (e: React.MouseEvent) => {
        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const totalSize = direction === "horizontal" ? rect.width : rect.height;
        const startPos = direction === "horizontal" ? e.clientX : e.clientY;
        const startSizes = [...sizes];

        function onMouseMove(ev: MouseEvent) {
          const currentPos = direction === "horizontal" ? ev.clientX : ev.clientY;
          const deltaPx = currentPos - startPos;
          const deltaPct = (deltaPx / totalSize) * 100;

          const newSizes = [...startSizes];
          const leftIdx = separatorIndex;
          const rightIdx = separatorIndex + 1;

          let newLeft = startSizes[leftIdx] + deltaPct;
          let newRight = startSizes[rightIdx] - deltaPct;

          // Enforce minimums
          if (newLeft < mins[leftIdx]) {
            newRight -= mins[leftIdx] - newLeft;
            newLeft = mins[leftIdx];
          }
          if (newRight < mins[rightIdx]) {
            newLeft -= mins[rightIdx] - newRight;
            newRight = mins[rightIdx];
          }

          // Final clamp
          newLeft = Math.max(mins[leftIdx], newLeft);
          newRight = Math.max(mins[rightIdx], newRight);

          newSizes[leftIdx] = newLeft;
          newSizes[rightIdx] = newRight;
          saveSizes(newSizes);
        }

        function onMouseUp() {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
        document.body.style.userSelect = "none";
      };
    },
    [sizes, direction, mins, storageKey]
  );

  return { sizes, containerRef, onDragStart };
}
