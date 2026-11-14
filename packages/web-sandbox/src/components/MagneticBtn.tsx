/**
 * MagneticBtn — Awwwards SOTD magnetic CTA button.
 *
 * On hover: button physically follows the cursor with elastic ease.
 * On leave: snaps back to origin with power3.out.
 *
 * Wraps any child; pass className / style for styling.
 */

import { useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import gsap from "gsap";

interface MagneticBtnProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  strength?: number; // 0–1, how far it follows the cursor; default 0.35
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export function MagneticBtn({
  children,
  className,
  style,
  strength = 0.35,
  href,
  onClick,
  target,
  rel,
}: MagneticBtnProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const el = ref.current;
    if (!el) return;

    const qx = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const qy = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      qx((e.clientX - cx) * strength);
      qy((e.clientY - cy) * strength);
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={className}
        style={{ ...style, display: "inline-flex" }}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={className}
      style={{ ...style, display: "inline-flex" }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
