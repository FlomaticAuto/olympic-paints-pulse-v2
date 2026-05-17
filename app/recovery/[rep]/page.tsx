import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { TabStrip } from "@/components/TabStrip";
import { loadRecovery, REPS, REP_NAMES, type RepCode } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => REPS.map((rep) => ({ rep }));

export default async function RecoveryPage({ params }: { params: Promise<{ rep: string }> }) {
  const { rep } = await params;
  if (!(REPS as readonly string[]).includes(rep)) notFound();
  const repCode = rep as RepCode;
  const snap = await loadRecovery(repCode);

  if (!snap) {
    return (
      <div className="pulse-page">
        <div className="pulse-shell">
          <Header title={`Recovery · ${repCode}`} subtitle={REP_NAMES[repCode]} />
          <TabStrip rep={repCode} active="recovery" />
          <div className="pulse-section">
            <div className="empty">No data published yet.</div>
          </div>
        </div>
      </div>
    );
  }

  const worst = snap.accounts[0]?.score ?? 0;

  return (
    <div className="pulse-page">
      <div className="pulse-shell">
        <Header
          title={`Recovery · ${repCode}`}
          subtitle={`${snap.rep_name} · ${snap.accounts.length} accounts`}
          outstanding={snap.competitor_forms_outstanding}
        />
        <TabStrip rep={repCode} active="recovery" />
        <div className="pulse-section">
          <h2>Recovery accounts · {snap.accounts.length} total</h2>

          {snap.accounts.length === 0 && <div className="empty">No recovery accounts flagged. Nice clean book.</div>}

          {snap.accounts.length > 0 && (
            <>
              <div className="metric-grid" style={{ marginBottom: 16 }}>
                <div className="metric">
                  <div className="metric-label">Recovery accounts</div>
                  <div className="metric-value" style={{ color: "var(--color-danger-fg)" }}>
                    {snap.accounts.length}
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">Worst score</div>
                  <div className="metric-value" style={{ color: "var(--color-danger-fg)" }}>
                    {Math.round(worst)}
                  </div>
                </div>
              </div>

              {snap.accounts.map((r, i) => (
                <Link
                  key={r.accno}
                  href={`/today/${repCode}/store/${r.accno}`}
                  className="store-link"
                  style={{ marginBottom: 10 }}
                >
                  <div className="store-row-top">
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 17,
                          color: "var(--color-text-primary)",
                          textTransform: "uppercase",
                          lineHeight: 1.15,
                        }}
                      >
                        {r.store_name}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--color-text-secondary)",
                          marginTop: 4,
                          display: "flex",
                          gap: 14,
                          flexWrap: "wrap",
                        }}
                      >
                        <span>{r.accno}</span>
                        <span>{r.days_since_purchase} days quiet</span>
                        {r.tier && <span>{r.tier}</span>}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 900,
                        fontSize: 14,
                        color: "var(--color-danger-fg)",
                        padding: "4px 10px",
                        borderRadius: "var(--r-pill)",
                        background: "var(--color-danger-bg)",
                        border: "1px solid var(--color-danger-bd)",
                      }}
                    >
                      #{i + 1}
                    </span>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
