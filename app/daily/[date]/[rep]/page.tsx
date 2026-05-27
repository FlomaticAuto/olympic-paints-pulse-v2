import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { TabStrip } from "@/components/TabStrip";
import { loadDaily, fmtR, fmtPct, REPS, REP_NAMES, type RepCode } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = true;
export const generateStaticParams = () => REPS.map((rep) => ({ date: "latest", rep }));

export default async function DailyPage({
  params,
}: {
  params: Promise<{ date: string; rep: string }>;
}) {
  const { date, rep } = await params;
  if (!(REPS as readonly string[]).includes(rep)) notFound();
  const repCode = rep as RepCode;
  const snap = await loadDaily(date, repCode);

  if (!snap) {
    return (
      <div className="pulse-page">
        <div className="pulse-shell">
          <Header title={`Daily · ${repCode}`} subtitle={REP_NAMES[repCode]} />
          <TabStrip rep={repCode} active="daily" />
          <div className="pulse-section">
            <div className="empty">No data published yet. Snapshots refresh weekday mornings.</div>
          </div>
        </div>
      </div>
    );
  }

  const pctTarget = snap.mtd_target ? snap.mtd_sales / snap.mtd_target : 0;
  const kpis = [
    { big: fmtR(snap.mtd_sales), label: `MTD · ${fmtPct(pctTarget)}` },
    { big: `#${snap.rank}/5`, label: "Team rank" },
    { big: fmtPct(snap.plan_adherence_mtd), label: "Plan adh." },
  ];

  return (
    <div className="pulse-page">
      <div className="pulse-shell">
        <Header title={`Daily · ${repCode}`} subtitle={`${snap.rep_name} · ${snap.date_label}`} />
        <TabStrip rep={repCode} active="daily" />

        {/* KPI strip */}
        <div className="pulse-section">
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
            }}
          >
            {kpis.map((k) => (
              <div
                key={k.label}
                style={{
                  background: "var(--color-surface-sunken)",
                  border: "1px solid var(--color-border-subtle)",
                  borderRadius: "var(--r-md)",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: 24,
                    color: "var(--color-text-primary)",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {k.big}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--color-text-tertiary)",
                    marginTop: 6,
                  }}
                >
                  {k.label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 10 }}>
            Cycle {snap.cycle_label}
          </div>
        </div>

        {/* Yesterday */}
        <div className="pulse-section">
          <h2>
            Yesterday — {snap.yesterday_visits_total}{" "}
            {snap.yesterday_visits_total === 1 ? "visit" : "visits"} logged
          </h2>
          {snap.yesterday_visited_stores.length === 0 ? (
            <div className="empty">No visits logged yesterday.</div>
          ) : (
            <div>
              {snap.yesterday_visited_stores.map((store, i) => (
                <div
                  key={store + i}
                  style={{
                    padding: "12px 14px",
                    background: "var(--color-surface-sunken)",
                    border: "1px solid var(--color-border-subtle)",
                    borderRadius: "var(--r-md)",
                    marginBottom: 8,
                    fontSize: 14,
                    color: "var(--color-text-primary)",
                  }}
                >
                  <span style={{ color: "var(--color-success-fg)", fontWeight: 800, marginRight: 8 }}>
                    ✓
                  </span>
                  {store}
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 10 }}>
            Sales:{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>{fmtR(snap.yesterday_sales)}</strong>
            {" · "}Leads:{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>{snap.yesterday_leads}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
