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

interface ImageStatsCardProps {
  data: CardData;
  width?: number | string;
  height?: number | string;
}

export const ImageStatsCard: React.FC<ImageStatsCardProps> = ({
  data,
  width = "100%",
  height = "100%",
}) => {
  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        background: "#0f0f11",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
        fontFamily,
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Country Badge - Top Left */}
      <div style={{ position: "absolute", top: "25px", left: "25px", zIndex: 10 }}>
        {data.country && (
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(4px)",
              padding: "8px 16px",
              borderRadius: "50px",
              fontSize: "16px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {data.country}
          </div>
        )}
      </div>

      {/* Main Image Area */}
      <div
        style={{
          flex: "1 1 65%",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          marginTop: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
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
            }}
          />
        ) : (
          <div style={{ fontSize: "50px", opacity: 0.2 }}>No Image</div>
        )}

        {/* Subtle gradient at bottom of image */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to top, #0f0f11 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Info Section */}
      <div
        style={{
          flex: "0 0 35%",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          background: "#0f0f11",
        }}
      >
        <h1
          style={{
            margin: "0 0 10px 0",
            fontSize: "64px",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-1px",
          }}
        >
          {data.title}
        </h1>

        {data.rankNumber !== undefined && (
          <div
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#3498db", // Different accent color for this card style
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {data.rankNumber} GOALS
          </div>
        )}
      </div>
    </div>
  );
};
