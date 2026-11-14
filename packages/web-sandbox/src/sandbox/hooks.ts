/**
 * Sandbox hooks — shared animation utilities.
 *
 * useTypewriter: constant-speed char reveal with caret (gsap-choreography pattern)
 * useAnimatedCounter: GSAP countTo, fires on first visible (IntersectionObserver)
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ── Typewriter ──────────────────────────────────────────────────────────────

interface TypewriterOptions {
  text: string;
  charsPerSecond?: number; // default 60 — constant speed, never stagger-random
  delay?: number;          // ms before start
  onDone?: () => void;
}

export function useTypewriter({
  text,
  charsPerSecond = 60,
  delay = 0,
  onDone,
}: TypewriterOptions) {
  const [displayed, setDisplayed] = useState("");
  const [showCaret, setShowCaret] = useState(false);
  const tlRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplayed(text);
      setShowCaret(false);
      onDone?.();
      return;
    }

    tlRef.current?.kill();
    setDisplayed("");
    setShowCaret(true);

    const obj = { idx: 0 };
    const totalChars = text.length;
    const duration = totalChars / charsPerSecond;

    const timer = window.setTimeout(() => {
      tlRef.current = gsap.to(obj, {
        idx: totalChars,
        duration,
        ease: "none", // constant speed — gsap-choreography requirement
        roundProps: "idx",
        onUpdate: () => {
          setDisplayed(text.slice(0, Math.round(obj.idx)));
        },
        onComplete: () => {
          setDisplayed(text);
          setShowCaret(false);
          onDone?.();
        },
      });
    }, delay);

    return () => {
      clearTimeout(timer);
      tlRef.current?.kill();
    };
  }, [text, charsPerSecond, delay]);

  return { displayed, showCaret };
}

// ── Animated counter ────────────────────────────────────────────────────────

interface CounterOptions {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;   // decimal places in display
  prefix?: string;
  suffix?: string;
}

export function useAnimatedCounter({
  to,
  from = 0,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
}: CounterOptions) {
  const [display, setDisplay] = useState(
    `${prefix}${from.toFixed(decimals)}${suffix}`,
  );
  const ref = useRef<HTMLElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    fired.current = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || fired.current) return;
        fired.current = true;

        const obj = { val: from };
        gsap.to(obj, {
          val: to,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            setDisplay(`${prefix}${obj.val.toFixed(decimals)}${suffix}`);
          },
          onComplete: () => {
            setDisplay(`${prefix}${to.toFixed(decimals)}${suffix}`);
          },
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [to, from, duration, decimals, prefix, suffix]);

  // Reset if `to` changes (e.g. friction score updated)
  useEffect(() => {
    if (fired.current) {
      const obj = { val: from };
      gsap.to(obj, {
        val: to,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          setDisplay(`${prefix}${obj.val.toFixed(decimals)}${suffix}`);
        },
      });
    }
  }, [to]);

  return { display, ref };
}
