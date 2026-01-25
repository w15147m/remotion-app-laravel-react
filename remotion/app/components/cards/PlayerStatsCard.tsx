import React from "react";
import { Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { GenericCardData } from "../../remotion/schemata";
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
        borderRadius: "24px",
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
      {/* Background Texture */}
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

      {/* --- TOP SECTION --- */}

      {/* Top Left: Country Badge */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          zIndex: 10,
        }}
      >
        {data.country && (
          <div
            style={{
              background: "#FFD700", // Gold background for country
              color: "#000",
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            {data.country}
          </div>
        )}
      </div>

      {/* Top Right: Icon */}
      {data.icon && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            fontSize: "60px",
            zIndex: 10,
            filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.3))",
          }}
        >
          {data.icon}
        </div>
      )}

      {/* --- IMAGE SECTION --- */}
      <div
        style={{
          flex: "1 1 55%",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          marginTop: "100px",
        }}
      >
        {data.mediaUrl ? (
          <Img
            src={data.mediaUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "bottom center",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
              transform: "scale(1.15)",
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
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: "#444",
              }}
            />
          </div>
        )}

        {/* Gradient Fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "150px",
            background: "linear-gradient(to top, #1e1e24 0%, transparent 100%)",
          }}
        />
      </div>

      {/* --- INFO SECTION --- */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          padding: "40px",
          background: "#1e1e24",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Title (Name) - Slightly Reduced */}
        <h1
          style={{
            margin: 0,
            fontSize: "60px", // Reduced from 90px
            fontWeight: 900,
            lineHeight: 0.95,
            background: "linear-gradient(90deg, #fff, #bbb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-1px",
            textAlign: "center",
          }}
        >
          {data.title}
        </h1>

        {/* Goals (Replaces Subtitle) */}
        {data.rankNumber !== undefined && data.rankNumber !== null && (
          <div
            style={{
              fontSize: "40px",
              color: "#FFD700", // Gold color for goals
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: "5px",
              textAlign: "center",
            }}
          >
            GOALS : {data.rankNumber}
          </div>
        )}

        {/* Footer Stats Grid */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {data.yearRange && (
            <div>
              <div style={{ fontSize: "14px", color: "#666", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>Active</div>
              <div style={{ fontSize: "24px", fontWeight: 700 }}>{data.yearRange}</div>
            </div>
          )}

          {data.label && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", color: "#666", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>Highlight</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#ccc" }}>{data.label}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
