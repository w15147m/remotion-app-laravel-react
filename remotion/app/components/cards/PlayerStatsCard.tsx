import React from "react";
import { Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { GenericCardData } from "../../remotion/schemata"; // Use schema type or shared interface
import { z } from "zod";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

type CardData = z.infer<typeof GenericCardData>;

interface PlayerStatsCardProps {
  data: CardData;
  width?: number | string;
  height?: number | string;
}

export const PlayerStatsCard: React.FC<PlayerStatsCardProps> = ({
  data,
  width = "100%",
  height = "100%",
}) => {
  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        background: "linear-gradient(180deg, #1e1e24 0%, #2b2b36 100%)",
        borderRadius: "24px", // Rounded corners
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        fontFamily,
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Background Pattern/Texture (Optional subtle overlay) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background:
            "radial-gradient(circle at top right, #ffffff 0%, transparent 40%)",
          zIndex: 0,
        }}
      />

      {/* Top Section: Rank & Icon */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {data.rankNumber !== undefined && data.rankNumber !== null && (
          <div
            style={{
              background: "#FFD700",
              color: "#000",
              padding: "5px 15px",
              borderRadius: "50px",
              fontWeight: "900",
              fontSize: "24px",
              boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
            }}
          >
            #{data.rankNumber}
          </div>
        )}
        {data.rankLabel && (
          <span
            style={{
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontSize: "14px",
              fontWeight: 700,
              opacity: 0.8,
            }}
          >
            {data.rankLabel}
          </span>
        )}
      </div>

      {/* Icon Top Right */}
      {data.icon && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            fontSize: "40px",
            zIndex: 10,
            filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.3))",
          }}
        >
          {data.icon}
        </div>
      )}

      {/* Image Section - Dominant */}
      <div
        style={{
          flex: "1 1 60%", // Takes up ~60% of height
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          marginTop: "60px", // Space for top badges
        }}
      >
        {data.mediaUrl ? (
          <Img
            src={data.mediaUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // Keep aspect ratio, might need cover depending on assets
              objectPosition: "bottom center",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
              transform: "scale(1.1)", // Slight zoom
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "#444",
              }}
            />
          </div>
        )}

        {/* Gradient Fade at bottom of image to blend with info */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100px",
            background: "linear-gradient(to top, #1e1e24 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Info Section - Bottom */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          padding: "25px",
          background: "#1e1e24", // Solid background for text readability
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Country Badge */}
        {data.country && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "rgba(255,255,255,0.1)",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#ccc",
            }}
          >
            {data.country}
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            margin: 0,
            fontSize: "36px",
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(90deg, #fff, #aaa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {data.title}
        </h1>

        {/* Subtitle */}
        {data.subtitle && (
          <div
            style={{
              fontSize: "18px",
              color: "#888",
              fontWeight: 500,
            }}
          >
            {data.subtitle}
          </div>
        )}

        {/* Stats Grid / Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
            paddingTop: "15px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {data.yearRange && (
            <div>
              <div style={{ fontSize: "10px", color: "#666", textTransform: "uppercase" }}>Active</div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>{data.yearRange}</div>
            </div>
          )}

          {data.label && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: "#666", textTransform: "uppercase" }}>Highlight</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFD700" }}>{data.label}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
