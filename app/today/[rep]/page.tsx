import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { TabStrip } from "@/components/TabStrip";
import { StoreBadge, storeTone } from "@/components/StoreBadge";
import { loadToday, fmtR, REPS, REP_NAMES, type RepCode } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => REPS.map((rep) => ({ rep }));

export default async function TodayPage({ params }: { params: Promise<{ rep: string }> }) {
  const { rep } = await params;
  if (!(REPS as readonly string[]).includes(rep)) notFound();
  const repCode = rep as RepCode;
  const snap = await loadToday(repCode);

  if (!snap) {
    return (
      <div className="pulse-page">
        <div className="pulse-shell">
          <Header title={`Today · ${repCode}`} subtitle={REP_NAMES[repCode]} />
          <TabStrip rep={repCode} active="today" />
          <div className="pulse-section">
            <div className="empty">No data published yet. Snapshots refresh weekday mornings.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pulse-page">
      <div className="pulse-shell">
        <Header
          title={`Today · ${repCode}`}
          subtitle={`${snap.rep_name} · ${snap.date_label}`}
          outstanding={snap.competitor_forms_outstanding}
        />
        <TabStrip rep={repCode} active="today" />
        <div className="pulse-section">
          <h2>
            {snap.date_label} · {snap.stores.length} {snap.stores.length === 1 ? "store" : "stores"}
          </h2>

          {snap.stores.length === 0 && <div className="empty">No stores planned for today.</div>}

          {snap.stores.map((store) => {
            const { tone } = storeTone(store);
            return (
              <Link
                key={store.accno || store.curef || store.customer_name}
                className="store-link"
                href={`/today/${repCode}/store/${store.accno || store.curef}`}
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
                      {store.customer_name}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>
                      {store.town ? `${store.town} · ` : ""}
                      {store.accno || store.curef || ""}
                    </div>
                  </div>
                  <StoreBadge store={store} />
                </div>
                <div className="store-row-meta">
                  <div>
                    <strong>Last purchase</strong>
                    {store.last_purchase_date || "—"}
                    <br />
                    {fmtR(store.last_purchase_amt ?? 0)}
                  </div>
                  <div>
                    <strong>Outstanding</strong>
                    {(store.d_total ?? 0) > 0 ? (
                      <>
                        <span style={{ color: `var(--color-${tone}-fg)` }}>
                          {fmtR(store.d_total)}
                        </span>
                        {(store.d90 ?? 0) > 0 ? (
                          <>
                            <br />
                            <span style={{ fontSize: 11, color: "var(--color-danger-fg)" }}>
                              90+: {fmtR(store.d90)}
                            </span>
                          </>
                        ) : null}
                      </>
                    ) : (
                      <span style={{ color: "var(--color-text-tertiary)" }}>R 0</span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: "var(--color-brand-primary)",
                    fontWeight: 700,
                  }}
                >
                  View invoice &amp; full history →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
