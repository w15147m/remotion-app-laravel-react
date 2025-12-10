import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface LinearScrollItem {
  id: number;
  content: React.ReactNode;
}

interface LinearScrollAnimationProps {
  items: LinearScrollItem[];
  rotationDuration?: number; // Duration in seconds per item focus
  videoTitle?: string;
}

export const LinearScrollAnimation: React.FC<LinearScrollAnimationProps> = ({
  items,
  rotationDuration = 3,
  videoTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardWidth = 625;
  const gap = 100;
  const itemSpacing = cardWidth + gap;
  const framesPerItem = fps * rotationDuration;
  const progress = frame / framesPerItem;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
        overflow: "hidden",
      }}
    >
      {/* Scroll Container */}
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {items.map((item, index) => {

          const itemCount = items.length;

          let dist = (index - progress) % itemCount;

          if (dist < -itemCount / 2) dist += itemCount;
          if (dist > itemCount / 2) dist -= itemCount;

          const xOffset = dist * itemSpacing;

          const opacity = interpolate(
            Math.abs(dist),
            [0, 1.5, 2.5],
            [1, 1, 0],
            { extrapolateRight: "clamp" }
          );

          const scale = interpolate(
            Math.abs(dist),
            [0, 1],
            [1, 0.9],
            { extrapolateRight: "clamp" }
          );

          const zIndex = Math.round(100 - Math.abs(dist) * 10);

          return (
            <div
              key={item.id}
              style={{
                position: "absolute",
                left: "50%", // Start at center
                top: "50%",
                width: `${cardWidth}px`,
                height: "80%", // Allow space for title
                transform: `translateX(calc(-50% + ${xOffset}px)) translateY(-50%) scale(${scale})`,
                opacity,
                zIndex,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>

      {/* Video Title at Bottom */}
      {videoTitle && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#ffffff",
            fontSize: "48px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            padding: "0 40px",
            zIndex: 1000,
          }}
        >
          {videoTitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
