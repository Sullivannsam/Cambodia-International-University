import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * A slim progress bar fixed to the top of the viewport that plays briefly
 * on every route change (like GitHub/Linear/YouTube). Mount it once, near
 * the top of the app, inside the Router.
 */
export default function TopProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setVisible(true);
    setWidth(0);

    // Quick ramp to ~80%, then finish to 100% and fade out shortly after —
    // this mimics a real navigation/load without needing to track every
    // page's actual fetch state.
    timers.current.push(setTimeout(() => setWidth(35), 20));
    timers.current.push(setTimeout(() => setWidth(70), 160));
    timers.current.push(setTimeout(() => setWidth(100), 340));
    timers.current.push(setTimeout(() => setVisible(false), 620));

    return () => timers.current.forEach(clearTimeout);
  }, [location.pathname]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width: `${width}%`,
        background: "linear-gradient(90deg,#1e293b,#475569)",
        opacity: visible ? 1 : 0,
        transition: width === 0 ? "none" : "width 280ms ease, opacity 250ms ease 250ms",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
