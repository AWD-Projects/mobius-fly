/**
 * Dynamic Open Graph Image Generator
 * Mobius Fly - Empty Leg Marketplace
 *
 * Generates custom OG images for flight pages
 * Uses @vercel/og for edge rendering
 *
 * Usage: /api/og?origin=LAX&destination=JFK&date=2025-03-15
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// ============================================================================
// OG IMAGE CONFIGURATION
// ============================================================================

const OG_CONFIG = {
  width: 1200,
  height: 630,
  background: "#090E11", // Dark background matching brand
  primaryColor: "#C4A77D", // Gold accent
  textColor: "#F6F6F4", // Off-white
};

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const origin = searchParams.get("origin") || "XXX";
    const destination = searchParams.get("destination") || "XXX";
    const date = searchParams.get("date") || "";
    const price = searchParams.get("price") || "";
    const aircraft = searchParams.get("aircraft") || "";

    // Format date
    const formattedDate = date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

    // Generate image
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: OG_CONFIG.background,
            position: "relative",
            padding: "60px",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage:
                "radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)",
              backgroundSize: "100px 100px",
            }}
          />

          {/* Logo/Brand */}
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "60px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: OG_CONFIG.textColor,
                letterSpacing: "-0.5px",
              }}
            >
              Mobius Fly
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "24px",
              zIndex: 1,
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: OG_CONFIG.primaryColor,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Empty Leg Flight
            </div>

            {/* Route */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "40px",
              }}
            >
              <div
                style={{
                  fontSize: "110px",
                  fontWeight: 700,
                  color: OG_CONFIG.textColor,
                  letterSpacing: "-2px",
                }}
              >
                {origin}
              </div>

              {/* Arrow */}
              <div
                style={{
                  fontSize: "60px",
                  color: OG_CONFIG.primaryColor,
                }}
              >
                →
              </div>

              <div
                style={{
                  fontSize: "110px",
                  fontWeight: 700,
                  color: OG_CONFIG.textColor,
                  letterSpacing: "-2px",
                }}
              >
                {destination}
              </div>
            </div>

            {/* Details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {formattedDate && (
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 400,
                    color: OG_CONFIG.textColor,
                    opacity: 0.9,
                  }}
                >
                  {formattedDate}
                </div>
              )}

              {(price || aircraft) && (
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    fontSize: "20px",
                    color: OG_CONFIG.textColor,
                    opacity: 0.7,
                  }}
                >
                  {price && <span>From {price}</span>}
                  {price && aircraft && <span>•</span>}
                  {aircraft && <span>{aircraft}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Footer Badge */}
          <div
            style={{
              position: "absolute",
              bottom: "50px",
              right: "60px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 24px",
              backgroundColor: "rgba(196, 167, 125, 0.15)",
              borderRadius: "8px",
              border: `1px solid ${OG_CONFIG.primaryColor}`,
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: OG_CONFIG.primaryColor,
              }}
            >
              Book Now
            </div>
          </div>
        </div>
      ),
      {
        width: OG_CONFIG.width,
        height: OG_CONFIG.height,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback error image
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: OG_CONFIG.background,
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: OG_CONFIG.textColor,
            }}
          >
            Mobius Fly
          </div>
        </div>
      ),
      {
        width: OG_CONFIG.width,
        height: OG_CONFIG.height,
      }
    );
  }
}
