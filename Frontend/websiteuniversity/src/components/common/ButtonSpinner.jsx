import { Loader2 } from "lucide-react";

/**
 * Consistent inline spinner for use inside buttons during an async action
 * (submit, pay, approve/reject, save, etc). Usage:
 *
 *   <button disabled={saving}>
 *     {saving ? <ButtonSpinner label="Saving..." /> : "Save"}
 *   </button>
 */
export default function ButtonSpinner({ label, size = 15 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <Loader2 size={size} style={{ animation: "btnSpin 0.8s linear infinite" }} />
      {label}
      <style>{`@keyframes btnSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
