import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { TabStrip } from "@/components/TabStrip";
import { storeTone } from "@/components/StoreBadge";
import { loadWeek, REPS, REP_NAMES, type RepCode } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => REPS.map((rep) => ({ rep }));

export default async function WeekPage({ params }: { params: Promise<{ rep: string }> }) {
  const { rep } = await params;
  if (!(REPS as readonly string[]).includes(rep)) notFound();
  const repCode = rep as RepCode;
  const snap = await loadWeek(repCode);

  if (!snap) {
    return (
      <div className="pulse-page">
        <div className="pulse-shell">
          <Header title={`Week · ${repCode}`} subtitle={REP_NAMES[repCode]} />
          <TabStrip rep={repCode} active="week" />
          <div className="pulse-section">
            <div className="empty">No plan archived yet.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pulse-page">
      <div className="pulse-shell">
        <Header
          title={`Week · ${repCode}`}
          subtitle={`${snap.rep_name} · ${snap.week_label}`}
          outstanding={snap.competitor_forms_outstanding}
        />
        <TabStrip rep={repCode} active="week" />
        <div className="pulse-section">
          <h2>
            {snap.week_label} · {snap.total_stores} stores planned
          </h2>

          {snap.days.length === 0 && <div className="empty">No plan archived for this week yet.</div>}

          {snap.days.map((day) => (
            <div
              key={day.date_iso}
              style={{
                background: day.is_today ? "var(--color-surface-elevated)" : "var(--color-surface-sunken)",
                border: `1px solid ${day.is_today ? "var(--color-brand-primary)" : "var(--color-border-subtle)"}`,
                borderRadius: "var(--r-md)",
                padding: "14px 16px",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 14,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: day.is_today ? "var(--color-brand-primary)" : "var(--color-text-primary)",
                  }}
                >
                  {day.date_label}
                  {day.is_today ? " · Today" : ""}
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                  {day.stores.length} {day.stores.length === 1 ? "store" : "stores"}
                </div>
              </div>
              {day.stores.map((store, i) => {
                const { tone, label } = storeTone(store);
                const short = label === "Clean" ? "OK" : label === "Has balance" ? "Bal" : label.replace("Overdue ", "");
                return (
                  <Link
                    key={(store.accno || store.curef || i) + ""}
                    href={`/today/${repCode}/store/${store.accno || store.curef}`}
                    style={{
                      display: "block",
                      padding: "10px 0",
                      borderTop: i === 0 ? "0" : "1px solid var(--color-border-subtle)",
                      marginTop: i === 0 ? 8 : 0,
                      color: "inherit",
                      textDecoration: "none",
                      minHeight: 44,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "var(--color-text-primary)",
                        textTransform: "uppercase",
                        lineHeight: 1.15,
                      }}
                    >
                      {store.customer_name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        marginTop: 2,
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {store.town && <span>{store.town}</span>}
                      <span>{store.accno || store.curef || ""}</span>
                      <span className={`badge badge-${tone}`} style={{ padding: "1px 8px", fontSize: 10 }}>
                        {short}
                      </span>
                      {store.last_purchase_date && <span>Last: {store.last_purchase_date}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
