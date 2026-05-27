import { Header } from "@/components/Header";
import { loadScorecard, fmtR, fmtPct, type ScorecardRepRow } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = true;
export const generateStaticParams = () => [{ date: "latest" }];

function pctColour(pct: number): string {
  if (pct >= 0.9) return "var(--_teal)";
  if (pct >= 0.7) return "var(--_y400)";
  return "var(--_coral)";
}
function pctTone(pct: number): "success" | "warning" | "danger" {
  if (pct >= 0.9) return "success";
  if (pct >= 0.7) return "warning";
  return "danger";
}

function RankBadge({ rank }: { rank: number }) {
  const colours: Record<number, { bg: string; fg: string }> = {
    1: { bg: "var(--_y400)", fg: "var(--_g950)" },
    2: { bg: "var(--_n300)", fg: "var(--_n950)" },
    3: { bg: "var(--_terra)", fg: "#fff" },
  };
  const c = colours[rank] ?? { bg: "var(--color-surface-elevated)", fg: "var(--color-text-tertiary)" };
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: "var(--font-display)",
        fontWeight: 900,
        fontSize: 16,
        background: c.bg,
        color: c.fg,
      }}
    >
      {rank}
    </div>
  );
}

function ProgressBar({ value, colour }: { value: number; colour: string }) {
  const w = Math.min(100, Math.round(value * 100));
  return (
    <div style={{ height: 6, borderRadius: 50, width: "100%", background: "rgba(255,255,255,0.08)" }}>
      <div style={{ height: "100%", borderRadius: 50, width: `${w}%`, background: colour }} />
    </div>
  );
}

function Stat({ label, value, colour }: { label: string; value: string; colour?: string }) {
  return (
    <div>
      <div
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: 10,
          marginBottom: 4,
          color: "var(--color-text-tertiary)",
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: 700, fontSize: 13, color: colour ?? "var(--color-text-primary)" }}>
        {value}
      </div>
    </div>
  );
}

export default async function ScorecardPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const snap = await loadScorecard(date);

  if (!snap) {
    return (
      <div className="pulse-page">
        <div className="pulse-shell">
          <Header title="Scorecard" subtitle="Olympic Paints — Sales accountability" />
          <div className="pulse-section">
            <div className="empty">No scorecard published yet. Refreshes weekday mornings.</div>
          </div>
        </div>
      </div>
    );
  }

  const { period_label, summary, rep_rows } = snap;
  const sorted = [...rep_rows].sort((a, b) => b.pct_target - a.pct_target);

  const summaryCards = [
    { big: fmtR(summary.team_mtd), label: "Team Revenue", colour: "var(--color-brand-primary)" },
    { big: fmtPct(summary.team_pct_target), label: "vs Target", colour: pctColour(summary.team_pct_target) },
    {
      big: `${summary.team_visits_actual}/${summary.team_visits_planned}`,
      label: "Visits",
      colour: "var(--color-text-secondary)",
    },
    { big: fmtPct(summary.team_plan_adherence), label: "Plan Adherence", colour: pctColour(summary.team_plan_adherence) },
  ];

  return (
    <div className="pulse-page">
      <div className="pulse-shell">
        <Header title="Scorecard" subtitle={period_label} />

        {/* Team summary strip */}
        <div className="pulse-section">
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))" }}>
            {summaryCards.map((card) => (
              <div
                key={card.label}
                style={{
                  background: "var(--color-surface-sunken)",
                  border: "1px solid var(--color-border-subtle)",
                  borderTop: `3px solid ${card.colour}`,
                  borderRadius: "var(--r-md)",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: 22,
                    lineHeight: 1,
                    color: card.colour,
                  }}
                >
                  {card.big}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginTop: 8,
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rep ranking */}
        <div className="pulse-section">
          <h2>Rep ranking — month to date</h2>
          <div>
            {sorted.map((r: ScorecardRepRow, i) => {
              const rank = i + 1;
              return (
                <div
                  key={r.rep}
                  style={{
                    background: "var(--color-surface-sunken)",
                    border: "1px solid var(--color-border-subtle)",
                    borderRadius: "var(--r-md)",
                    overflow: "hidden",
                    marginBottom: 12,
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 12px" }}>
                    <RankBadge rank={rank} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 16, color: "var(--color-text-primary)", lineHeight: 1.15 }}>
                        {r.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 2 }}>{r.rep}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 900,
                          fontSize: 20,
                          lineHeight: 1,
                          color: "var(--color-text-primary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmtR(r.sales)}
                      </div>
                      <div
                        className="badge"
                        style={{
                          marginTop: 6,
                          background: `var(--color-${pctTone(r.pct_target)}-bg)`,
                          color: `var(--color-${pctTone(r.pct_target)}-fg)`,
                        }}
                      >
                        {fmtPct(r.pct_target)} of target
                      </div>
                    </div>
                  </div>

                  {/* Target progress */}
                  <div style={{ padding: "0 16px 12px" }}>
                    <ProgressBar value={r.pct_target} colour={pctColour(r.pct_target)} />
                  </div>

                  {/* Stats row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))",
                      gap: 12,
                      borderTop: "1px solid var(--color-border-subtle)",
                      padding: "12px 16px",
                    }}
                  >
                    <Stat label="Visits" value={`${r.visits_actual}/${r.visits_planned}`} />
                    <Stat label="Plan %" value={fmtPct(r.plan_adherence)} colour={pctColour(r.plan_adherence)} />
                    <Stat label="Leads" value={String(r.leads)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
