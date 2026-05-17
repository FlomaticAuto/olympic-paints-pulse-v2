type Props = {
  title: string;
  subtitle: string;
  outstanding?: number;
};

export function Header({ title, subtitle, outstanding }: Props) {
  return (
    <div className="pulse-header">
      <div className="pulse-logo">
        <img src="https://flomaticauto.github.io/olympic-paints-clocking/logo.jpg" alt="Olympic Paints" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="pulse-h1">{title}</h1>
        <div className="pulse-h1-sub">{subtitle}</div>
      </div>
      {outstanding && outstanding > 0 ? (
        <a
          href="https://olympic-paints-forms-admin.vercel.app"
          title="Competitor forms still to complete"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 50,
            background: "var(--color-danger-bg)",
            color: "var(--color-danger-fg)",
            border: "1px solid var(--color-danger-bd)",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            textDecoration: "none",
            minHeight: 36,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 24,
              height: 24,
              borderRadius: "50%",
              background: "var(--color-danger-fg)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 900,
              padding: "0 6px",
            }}
          >
            {outstanding}
          </span>
          Comp forms
        </a>
      ) : null}
    </div>
  );
}
