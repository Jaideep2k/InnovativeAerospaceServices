import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.legalName} — avionics, rewiring and electrical services, Kelowna BC`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0D0D",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 96, height: 10, background: "#E31B23" }} />
          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              textTransform: "uppercase",
            }}
          >
            Every Wire. Every Panel. Every Flight.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#BFC3C7",
              maxWidth: 900,
            }}
          >
            Avionics · Aircraft Rewiring · Wiring Harnesses · Laser Wire Marking
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid rgba(255,255,255,0.16)",
            paddingTop: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {site.shortName}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#BFC3C7" }}>
            {site.address.facility} · {site.address.city}, {site.address.region}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
