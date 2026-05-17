import Link from "next/link";
import { Header } from "@/components/Header";
import { REPS, REP_NAMES } from "@/lib/data";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="pulse-page">
      <div className="pulse-shell">
        <Header title="PULSE v2" subtitle="Olympic Paints — Sales accountability" />
        <div className="pulse-section">
          <h2>Reps</h2>
          {REPS.map((rep) => (
            <Link key={rep} href={`/today/${rep}`} className="store-link">
              <div className="store-row-top">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: 18,
                      textTransform: "uppercase",
                    }}
                  >
                    {rep} · {REP_NAMES[rep]}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>
                    Open today's plan →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
