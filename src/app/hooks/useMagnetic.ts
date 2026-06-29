import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Magnetic hover: the element eases toward the pointer. No-ops under
 * reduced-motion and on coarse (touch) pointers. Spread the returned handlers
 * onto any element and attach `ref`.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(strength = 0.3) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();

  const onPointerMove = (e: ReactPointerEvent<T>) => {
    const el = ref.current;
    if (!el || reduce) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return { ref, onPointerMove, onPointerLeave };
}
