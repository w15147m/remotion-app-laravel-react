import React from "react";
import { Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { GenericCardData } from "../../remotion/schemata";
import { z } from "zod";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "500", "700"],
  subsets: ["latin"],
});

type CardData = z.infer<typeof GenericCardData>;

interface MinimalCardProps {
  data: CardData;
  width?: number | string;
  height?: number | string;
}

export const MinimalCard: React.FC<MinimalCardProps> = ({
  data,
  width = "100%",
  height = "100%",
}) => {
  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)", // Softer shadow
        fontFamily,
        color: "#333",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Half: Image */}
      <div
        style={{
          height: "60%",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        }}
      >
        {data.mediaUrl ? (
          <Img
            src={data.mediaUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
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
              color: "#ccc",
              fontSize: "40px",
            }}
          >
            {data.title?.[0]}
          </div>
        )}

        {/* Floating Rank Badge */}
        {data.rankNumber !== undefined && data.rankNumber !== null && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              background: "black",
              color: "white",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "18px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            {data.rankNumber}
          </div>
        )}
      </div>

      {/* Bottom Half: Info - Clean Typography */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "5px",
            fontWeight: 500,
          }}
        >
          {data.country || "Player"}
        </div>

        <h2
          style={{
            margin: "0 0 10px 0",
            fontSize: "32px",
            fontWeight: 300, // Thinner font for minimal look
            lineHeight: 1.1,
            color: "#000",
          }}
        >
          {data.title}
        </h2>

        {data.subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              color: "#555",
              lineHeight: 1.5,
            }}
          >
            {data.subtitle}
          </p>
        )}

        <div style={{ flex: 1 }} />

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            borderTop: "1px solid #eee",
            paddingTop: "20px",
          }}
        >
          {data.rankLabel && (
            <div style={{ fontWeight: 700, fontSize: "14px", color: "#333" }}>
              {data.rankLabel}
            </div>
          )}
          {data.yearRange && (
            <div style={{ fontSize: "14px", color: "#888" }}>
              {data.yearRange}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
