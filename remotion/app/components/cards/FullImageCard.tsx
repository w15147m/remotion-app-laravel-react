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

interface FullImageCardProps {
  data: CardData;
  width?: number | string;
  height?: number | string;
}

export const FullImageCard: React.FC<FullImageCardProps> = ({
  data,
  width = "100%",
  height = "100%",
}) => {
  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
        fontFamily,
        color: "white",
        position: "relative",
      }}
    >
      {/* Full Background Image */}
      {data.mediaUrl && (
        <Img
          src={data.mediaUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      {/* Dark Gradient Overlay for Readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          zIndex: 1,
        }}
      />

      {/* Top Badges */}
      <div style={{ position: "absolute", top: "30px", left: "30px", zIndex: 10 }}>
        {data.country && (
          <div
            style={{
              background: "#e74c3c",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              fontSize: "20px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
              display: "inline-block",
            }}
          >
            {data.country}
          </div>
        )}
      </div>

      <div style={{ position: "absolute", top: "30px", right: "30px", fontSize: "60px", zIndex: 10 }}>
        {data.icon}
      </div>

      {/* Bottom Content */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          right: "40px",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            margin: "0 0 10px 0",
            fontSize: "80px",
            fontWeight: 900,
            lineHeight: 0.9,
            textShadow: "0 4px 10px rgba(0,0,0,0.5)",
            background: "linear-gradient(to right, #ffffff, #e0e0e0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {data.title}
        </h1>

        <div style={{ display: "flex", alignItems: "baseline", gap: "20px" }}>
          {data.rankNumber !== undefined && (
            <div
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "#f1c40f",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {data.rankNumber} GOALS
            </div>
          )}

          {data.subtitle && (
            <div style={{ fontSize: "28px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
              {data.subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
