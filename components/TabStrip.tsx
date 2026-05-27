import Link from "next/link";

type Props = { rep: string; active: "overview" | "today" | "week" | "recovery" | "daily" | "scorecard" };

export function TabStrip({ rep, active }: Props) {
  const tabs: { key: Props["active"]; label: string; href: string }[] = [
    { key: "daily", label: "Daily", href: `/daily/latest/${rep}` },
    { key: "today", label: "Today", href: `/today/${rep}` },
    { key: "week", label: "Week", href: `/week/${rep}` },
    { key: "recovery", label: "Recovery", href: `/recovery/${rep}` },
    { key: "scorecard", label: "Scorecard", href: `/scorecard/latest` },
  ];
  return (
    <div className="tab-strip">
      {tabs.map((t) => (
        <Link key={t.key} href={t.href} className={t.key === active ? "active" : ""}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}
