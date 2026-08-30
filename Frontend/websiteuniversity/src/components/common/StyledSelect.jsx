import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function StyledSelect({ value, onChange, options, placeholder, disabled, width, style, buttonStyle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (ev) => {
      if (ref.current && !ref.current.contains(ev.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="ssel" ref={ref} style={width ? { width, minWidth: width } : undefined}>
      <button
        type="button"
        className={`ssel-btn${selected ? "" : " ssel-ph"}`}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        style={buttonStyle}
      >
        <span className="ssel-val">{selected ? selected.label : (placeholder || "Select...")}</span>
        <ChevronDown size={14} style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div className="ssel-menu" style={style}>
          {options.length ? options.map((o) => (
            <button
              type="button"
              key={o.value}
              className={`ssel-item${o.value === value ? " ssel-sel" : ""}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              <span>{o.label}</span>
              {o.value === value && <Check size={13} />}
            </button>
          )) : (
            <div className="ssel-empty">{placeholder || "No options"}</div>
          )}
        </div>
      )}
      <style>{`
        .ssel { position: relative; display: inline-block; vertical-align: middle; }
        .ssel-btn { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; min-width: 160px; padding: 9px 12px; font-size: 13px; font-weight: 500; color: var(--text-primary); background: var(--input-bg); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; text-align: left; }
        .ssel-btn:hover { border-color: #3E5EDB; }
        .ssel-ph { color: var(--text-muted); }
        .ssel-val { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ssel-menu { position: absolute; top: calc(100% + 6px); left: 0; z-index: 1000; min-width: 100%; max-height: 300px; overflow: auto; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 12px 32px rgba(24,38,68,0.16); padding: 6px; animation: sselPop .14s ease; }
        .ssel-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; padding: 9px 12px; font-size: 13px; color: var(--text-primary); background: none; border: none; border-radius: 7px; cursor: pointer; text-align: left; }
        .ssel-item:hover { background: var(--hover-bg); color: #3E5EDB; }
        .ssel-sel { background: var(--hover-bg); color: #3E5EDB; font-weight: 600; }
        .ssel-sel:hover { background: var(--hover-bg); color: #3E5EDB; }
        .ssel-empty { padding: 10px 12px; font-size: 13px; color: var(--text-muted); }
        .ssel-btn:disabled { opacity: .55; cursor: not-allowed; }
        @keyframes sselPop { from { opacity: 0; transform: translateY(-6px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}