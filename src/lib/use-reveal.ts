"use client";

import { useEffect, useRef, useState } from "react";

export type RevealState = "idle" | "pending" | "visible";

/**
 * Reveal-on-scroll hook. The static HTML renders elements visible by default
 * (idle state). After hydration, this hook decides per-element:
 *   - already in viewport, or reduced-motion: stay visible (no animation)
 *   - below the fold: set "pending" (hidden) and wait for IntersectionObserver
 *     to fire, then transition to "visible"
 *
 * Inverting the default this way avoids two regressions of the naive CSS-only
 * approach: above-the-fold elements never flicker, and JS-disabled / failed-
 * hydration users still see all content.
 */
export function useReveal<T extends Element = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<RevealState>("idle");

  // Runs ONCE on mount. State transitions intentionally do not re-trigger this
  // effect -- if it depended on `state`, every setState below would tear down
  // and recreate the IntersectionObserver, losing the entry event if the
  // element scrolled in during the brief gap.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reduced-motion: keep element visible, skip animation entirely.
      // The setState calls in this effect are mount-time normalization to the
      // correct initial state, not per-render updates -- the cascading-render
      // concern the rule guards against does not apply (deps are [], so this
      // effect never re-runs).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("visible");
      return;
    }

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportH =
      window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < viewportH && rect.bottom > 0) {
      // Already in view at mount -- no animation; leave visible to avoid flicker.
      setState("visible");
      return;
    }

    // Below the fold: hide it now, observe for entry.
    setState("pending");

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("visible");
          io.disconnect();
        }
      },
      { rootMargin: "-80px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, state };
}
