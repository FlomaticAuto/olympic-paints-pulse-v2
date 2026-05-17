import type { Store } from "@/lib/data";

export function storeTone(s: Store): { tone: "success" | "warning" | "danger" | "neutral"; label: string } {
  const d_total = s.d_total ?? 0;
  const d90 = s.d90 ?? 0;
  const d60 = s.d60 ?? 0;
  if (d90 > 0) return { tone: "danger", label: "Overdue 90+" };
  if (d60 > 0) return { tone: "warning", label: "Overdue 60+" };
  if (d_total > 0) return { tone: "neutral", label: "Has balance" };
  return { tone: "success", label: "Clean" };
}

export function StoreBadge({ store }: { store: Store }) {
  const { tone, label } = storeTone(store);
  return <span className={`badge badge-${tone}`}>{label}</span>;
}
