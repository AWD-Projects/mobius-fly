import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
const BG = "#090E11";
const GOLD = "#C4A77D";
const TEXT = "#F6F6F4";

interface OgProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: string;
}

export function renderOg({ eyebrow, title, subtitle, footer }: OgProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `radial-gradient(circle at 85% 10%, #1a2329 0%, ${BG} 60%)`,
          color: TEXT,
          borderTop: `8px solid ${GOLD}`,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: GOLD, textTransform: "uppercase" }}>
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ display: "flex", fontSize: 34, color: "#b8bcc0" }}>{subtitle}</div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30 }}>
          <div style={{ display: "flex", fontWeight: 700, color: GOLD }}>MOBIUS FLY</div>
          <div style={{ display: "flex", color: "#b8bcc0" }}>{footer ?? "mobiusfly.com"}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
