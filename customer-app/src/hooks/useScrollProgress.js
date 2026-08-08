import { useEffect, useRef, useState } from "react";

/**
 * Tracks how far an element has scrolled through the viewport, as a 0–1 value.
 * 0 = element's top just entered the bottom of the viewport
 * 1 = element's bottom has reached the top of the viewport
 */
export function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = null;

    function update() {
      const node = ref.current;
      frame = null;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = rect.height + windowHeight;
      const scrolled = windowHeight - rect.top;
      const raw = scrolled / total;

      setProgress(Math.min(Math.max(raw, 0), 11));
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return [ref, progress];
}