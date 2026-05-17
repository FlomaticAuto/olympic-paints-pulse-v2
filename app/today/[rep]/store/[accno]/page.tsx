import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Header } from "@/components/Header";
import { loadStoreDetail, fmtR, REPS, REP_NAMES, type RepCode } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  /* Build static params from every store-*.json that has been published. */
  const params: { rep: string; accno: string }[] = [];
  const dataDir = path.join(process.cwd(), "public", "data");
  for (const rep of REPS) {
    const dir = path.join(dataDir, rep);
    try {
      const files = await fs.readdir(dir);
      for (const f of files) {
        const m = f.match(/^store-(.+)\.json$/);
        if (m) params.push({ rep, accno: m[1] });
      }
    } catch {
      // rep folder doesn't exist yet — nothing to add
    }
  }
  return params;
}

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ rep: string; accno: string }>;
}) {
  const { rep, accno } = await params;
  if (!(REPS as readonly string[]).includes(rep)) notFound();
  const repCode = rep as RepCode;
  const snap = await loadStoreDetail(repCode, accno);
  if (!snap) notFound();

  const { store, invoice } = snap;
  const d_total = store.d_total ?? 0;

  return (
    <div className="pulse-page">
      <div className="pulse-shell">
        <Link href={`/today/${repCode}`} className="back-link">
          ← Today's plan
        </Link>

        <Header
          title={store.customer_name}
          subtitle={`${store.town ? `${store.town} · ` : ""}${store.accno}`}
          outstanding={snap.competitor_forms_outstanding}
        />

        <div className="pulse-section">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {d_total <= 0 ? (
              <span className="badge badge-success">Clean account</span>
            ) : (store.d90 ?? 0) > 0 ? (
              <span className="badge badge-danger">90+ overdue</span>
            ) : (store.d60 ?? 0) > 0 ? (
              <span className="badge badge-warning">60+ overdue</span>
            ) : (
              <span className="badge badge-warning">Has balance</span>
            )}
            {store.health_tier && <span className="badge badge-neutral">{store.health_tier}</span>}
            {store.velocity_category && <span className="badge badge-neutral">{store.velocity_category}</span>}
          </div>
        </div>

        <div className="pulse-section">
          <h2>Debtors</h2>
          <div className="metric-grid">
            <div className="metric">
              <div className="metric-label">Total outstanding</div>
              <div className="metric-value">{fmtR(d_total)}</div>
            </div>
            <div className="metric">
              <div className="metric-label">12-month sales</div>
              <div className="metric-value">{fmtR(store.total_12m)}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Current</div>
              <div className="metric-value" style={{ fontSize: 18 }}>
                {fmtR(store.d_current)}
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">30 days</div>
              <div className="metric-value" style={{ fontSize: 18 }}>
                {fmtR(store.d30)}
              </div>
            </div>
            <div className="metric" style={{ borderColor: "var(--color-warning-bd)" }}>
              <div className="metric-label" style={{ color: "var(--color-warning-fg)" }}>
                60 days
              </div>
              <div className="metric-value" style={{ fontSize: 18, color: "var(--color-warning-fg)" }}>
                {fmtR(store.d60)}
              </div>
            </div>
            <div className="metric" style={{ borderColor: "var(--color-danger-bd)" }}>
              <div className="metric-label" style={{ color: "var(--color-danger-fg)" }}>
                90+ days
              </div>
              <div className="metric-value" style={{ fontSize: 18, color: "var(--color-danger-fg)" }}>
                {fmtR(store.d90)}
              </div>
            </div>
          </div>
        </div>

        <div className="pulse-section">
          <h2>
            Last invoice
            {invoice.invoice_no && (
              <span style={{ fontWeight: 400, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                {" "}
                · #{invoice.invoice_no}
              </span>
            )}
            {invoice.date && (
              <span style={{ fontWeight: 400, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                {" "}
                · {invoice.date}
              </span>
            )}
          </h2>

          {invoice.lines.length === 0 ? (
            <div style={{ color: "var(--color-text-tertiary)", fontSize: 14 }}>
              No previous invoice on record.
            </div>
          ) : (
            <div className="pulse-table-wrap">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="num qty">Qty</th>
                    <th className="num">Unit</th>
                    <th className="num">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((line, i) => (
                    <tr key={i}>
                      <td className="prod">{line.prodname}</td>
                      <td className="num qty">{Number.isInteger(line.qty) ? line.qty : line.qty.toFixed(2)}</td>
                      <td className="num">{fmtR(line.unit_price)}</td>
                      <td className="num">{fmtR(line.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="invoice-foot">
                <span className="total-label">
                  {invoice.count} {invoice.count === 1 ? "line" : "lines"}
                </span>
                <span className="total-amt">{fmtR(invoice.total)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
