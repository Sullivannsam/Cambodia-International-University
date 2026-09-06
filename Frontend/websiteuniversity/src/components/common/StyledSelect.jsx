import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export default function StyledSelect({ value, onChange, options, placeholder, disabled, width, style: menuStyle, buttonStyle }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const showing = open;

  const place = (menu) => {
    const btn = btnRef.current;
    if (!btn || !menu) return;
    const b = btn.getBoundingClientRect();
    const scY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const mh = menu.offsetHeight || 0;
    const menuW = Math.min(Math.max(b.width, 140), window.innerWidth - 32);
    const spaceBelow = window.innerHeight - b.bottom - 8;
    const spaceAbove = b.top - 8;
    const up = (spaceBelow < mh && spaceAbove > spaceBelow) || spaceBelow < 8;
    const left = Math.max(8, Math.min(b.left, window.innerWidth - menuW - 8));
    const top = (up ? b.top - mh - 10 : b.bottom + 10) + scY;
    Object.assign(menu.style, {
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      width: `${Math.round(menuW)}px`,
      minWidth: "0",
      visibility: "visible",
    });
  };

  // Measure after the menu mounts so we know its real height before showing.
  useLayoutEffect(() => {
    if (open && menuRef.current) {
      menuRef.current.style.visibility = "hidden";
      place(menuRef.current);
    }
  }, [open, value]);

  // Keep anchored as the page scrolls/resizes (trap the menu offset to the button).
  useEffect(() => {
    if (!open) return;
    const move = () => place(menuRef.current);
    move();
    const onScroll = () => { move(); };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    const onClick = (ev) => {
      if (menuRef.current && menuRef.current.contains(ev.target)) return;
      if (btnRef.current && btnRef.current.contains(ev.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Reposition after the menu content (height) changes and on value change.
  useLayoutEffect(() => {
    if (open && menuRef.current) place(menuRef.current);
  }, [open, value]);

  const selected = options.find((o) => o.value === value);

  return (
    <>
      <div className="ssel" ref={btnRef} style={width ? { width } : undefined}>
        <button
          type="button"
          className={`ssel-btn${selected ? "" : " ssel-ph"}`}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          style={buttonStyle}
        >
          <span className="ssel-val">{selected ? selected.label : (placeholder || "Select...")}</span>
          <ChevronDown size={14} style={{ transition: "transform .2s", flexShrink: 0, transform: showing ? "rotate(180deg)" : "none" }} />
        </button>
      </div>
      {open &&
        createPortal(
          <div ref={menuRef} className="ssel-menu" style={{
            ...menuStyle,
            position: "absolute",
            top: "0",
            left: "0",
            visibility: "hidden",
            minWidth: "0",
          }}>
            {options.length ? options.map((o) => (
              <button
                type="button"
                key={o.value}
                className={`ssel-item${o.value === value ? " ssel-sel" : ""}`}
                onClick={() => { setOpen(false); onChange(o.value); }}
              >
                <span className="ssel-item-txt">{o.label}</span>
                {o.value === value && <Check size={13} style={{ flexShrink: 0 }} />}
              </button>
            )) : (
              <div className="ssel-empty">{placeholder || "No options"}</div>
            )}
          </div>,
          document.body
        )}
      <style>{`
        .ssel { position: relative; display: inline-block; vertical-align: middle; }
        .ssel-btn { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; min-width: 0; padding: 9px 12px; font-size: 13px; font-weight: 500; color: var(--text-primary); background: var(--input-bg); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; text-align: left; }
        .ssel-btn:hover { border-color: #3E5EDB; }
        .ssel-ph { color: var(--text-muted); }
        .ssel-val { flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ssel-menu { position: absolute; left: 0; top: 0; z-index: 99999; max-height: 260px; overflow: auto; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 12px 32px rgba(24,38,68,0.16); padding: 6px; }
        .ssel-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; padding: 9px 12px; font-size: 13px; color: var(--text-primary); background: none; border: none; border-radius: 7px; cursor: pointer; text-align: left; }
        .ssel-item-txt { flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ssel-item:hover { background: var(--hover-bg); color: #3E5EDB; }
        .ssel-sel { background: var(--hover-bg); color: #3E5EDB; font-weight: 600; }
        .ssel-sel:hover { background: var(--hover-bg); color: #3E5EDB; }
        .ssel-empty { padding: 10px 12px; font-size: 13px; color: var(--text-muted); }
        .ssel-btn:disabled { opacity: .55; cursor: not-allowed; }
      `}</style>
    </>
  );
}
