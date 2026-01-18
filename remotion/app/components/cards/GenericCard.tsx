import React from "react";
import { Img, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";

const { fontFamily } = loadFont();

export interface GenericCardData {
  title: string | null;
  subtitle?: string | null;
  icon?: string | null;
  country?: string | null;
  yearRange?: string | null;
  label?: string | null;
  rankNumber?: number | null;
  rankLabel?: string | null;
  mediaUrl?: string | null;
  extraInfo?: string | null;
}

interface GenericCardProps {
  data: GenericCardData;
  index: number;
  width?: number | string;
  height?: number | string;
}

export const GenericCard: React.FC<GenericCardProps> = ({ data, index, width = "625px", height = "100%" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stagger animation for each card
  const delay = index * 5;
  const scale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 100,
    },
  });

  return (
    <div
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor: "#1a1a1a",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        marginBottom: "5%px",
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Image Section */}
      <div
        style={{
          position: "relative",
          height: "55%",
          backgroundColor: "#333",
          overflow: "hidden",
        }}
      >
        {/* Icon (Flag/Trophy/Award) */}
        {data.icon && (
          <div
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              fontSize: "40px",
              zIndex: 2,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: "8px",
              padding: "5px 10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {data.icon}
          </div>
        )}

        {/* Image */}
        {data.mediaUrl ? (
          <Img
            src={data.mediaUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #555 0%, #333 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "#666",
                border: "4px solid #888",
              }}
            />
          </div>
        )}

        {/* Year Range Badge */}
        {data.yearRange && (
          <div
            style={{
              position: "absolute",
              bottom: "15px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              color: "black",
              padding: "8px 20px",
              borderRadius: "8px",
              fontFamily,
              fontSize: "24px",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {data.yearRange}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "0",
        }}
      >
        {/* Title */}
        <div
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "20px",
            textAlign: "center",
            fontFamily,
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          {data.title || "Untitled"}
        </div>

        {/* Subtitle (Country/Region/etc) */}
        {data.subtitle && data.subtitle !== null && (
          <div
            style={{
              backgroundColor: "#e0e0e0",
              color: "black",
              padding: "15px",
              textAlign: "center",
              fontFamily,
              fontSize: "28px",
              fontWeight: "500",
            }}
          >
            {data.subtitle}
          </div>
        )}

        {/* Label (Death/Goals/etc) */}
        {data.label && data.label !== null && (
          <div
            style={{
              backgroundColor: "#999",
              color: "white",
              padding: "12px",
              textAlign: "center",
              fontFamily,
              fontSize: "24px",
              fontWeight: "500",
            }}
          >
            {data.label}
          </div>
        )}

        {/* Rank (Number + Label) */}
        {data.rankNumber !== undefined && data.rankNumber !== null && data.rankLabel && data.rankLabel !== null && (
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#FFD700",
              padding: "25px",
              textAlign: "center",
              fontFamily,
              fontSize: "48px",
              fontWeight: "bold",
              letterSpacing: "2px",
              textShadow: "0 0 20px rgba(255,215,0,0.5)",
            }}
          >
            {data.rankNumber} {data.rankLabel}
          </div>
        )}

        {/* Extra Info */}
        {data.extraInfo && data.extraInfo !== null && (
          <div
            style={{
              backgroundColor: "#4a4a4a",
              color: "white",
              padding: "15px",
              textAlign: "center",
              fontFamily,
              fontSize: "22px",
              fontWeight: "500",
            }}
          >
            {data.extraInfo}
          </div>
        )}
      </div>
    </div>
  );
};
