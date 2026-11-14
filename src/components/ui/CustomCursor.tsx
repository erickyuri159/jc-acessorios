"use client";

import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!mql.matches || reduce.matches || touch) return;

    const el = document.createElement("div");
    el.className = "earring-cursor";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2C6.34315 2 5 3.34315 5 5C5 6.30622 5.83481 7.41746 7 7.82929V10C7 10.5523 7.44772 11 8 11C8.55228 11 9 10.5523 9 10V7.82929C10.1652 7.41746 11 6.30622 11 5C11 3.34315 9.65685 2 8 2Z" fill="url(#eg)"/><circle cx="8" cy="5" r="1.2" fill="#f8e6b8"/><defs><linearGradient id="eg" x1="5" y1="2" x2="11" y2="11"><stop stop-color="#f8e6b8"/><stop offset="0.4" stop-color="#e7be6a"/><stop offset="1" stop-color="#b89b3c"/></linearGradient></defs></svg>`;
    document.body.appendChild(el);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.left = x + "px";
      el.style.top = y + "px";
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a,button,[role=button],label,.cursor-pointer")) {
        el.classList.add("is-hover");
      } else {
        el.classList.remove("is-hover");
      }
    };
    const down = () => el.classList.add("is-pressed");
    const up = () => el.classList.remove("is-pressed");
    const leave = () => el.classList.add("is-hidden");
    const enter = () => el.classList.remove("is-hidden");

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mousedown", down);
    document.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      el.remove();
    };
  }, []);

  return null;
}
