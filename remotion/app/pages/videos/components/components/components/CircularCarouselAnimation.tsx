import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface CircularCarouselItem {
  id: number;
  content: React.ReactNode;
}

interface CircularCarouselAnimationProps {
  items: CircularCarouselItem[];
  rotationDuration?: number; // Seconds per item
  videoTitle?: string;
  cardWidth?: number | string;
}

export const CircularCarouselAnimation: React.FC<CircularCarouselAnimationProps> = ({
  items,
  rotationDuration = 2,
  videoTitle,
  cardWidth = 500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const itemCount = items.length;
  const framesPerItem = fps * rotationDuration;
  const progress = frame / framesPerItem;

  // Ensure numeric width for calculations if needed, though we use it directly for style
  const numericWidth = typeof cardWidth === 'number' ? cardWidth : parseInt(cardWidth as string) || 500;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "hidden",
      }}
    >
      {/* Carousel Container */}
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {items.map((item, index) => {
          let dist = (index - progress) % itemCount;
          if (dist > itemCount / 2) dist -= itemCount;
          if (dist < -itemCount / 2) dist += itemCount;

          const range = [-3, -2, -1, 0, 1, 2, 3];

          // Opacity: Outer cards visible but faded
          const opacity = interpolate(
            dist,
            range,
            [0, 0.8, 0.9, 1, 0.9, 0.8, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Spread: Wider spread to reduce overlap
          // Center: 50%
          // Level 1: 30% / 70% 
          // Level 2: 10% / 90% (Pushed almost to edges)
          const left = interpolate(
            dist,
            range,
            [50, 10, 30, 50, 70, 90, 50],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Width: Constant for all cards as requested
          const width = numericWidth;

          // Height: Slight scale effect for depth, but much less drastic
          const height = interpolate(
            dist,
            range,
            [500, 600, 650, 700, 650, 600, 500],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Z-index
          const zIndex = Math.round(interpolate(
            dist,
            range,
            [0, 1, 5, 10, 5, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ));

          // Translate X % 
          const translateX = "-50";

          // Translate Y % 
          const translateY = interpolate(
            dist,
            range,
            [0, 5, 2, 0, 2, 5, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const style: React.CSSProperties = {
            position: "absolute",
            // No CSS transition!
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            left: `${left}%`,
            width: `${width}px`,
            height: `${height}px`,
            opacity,
            zIndex,
            transform: `translate(${translateX}%, ${translateY}%)`,
          };

          return (
            <div key={item.id} style={style}>
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
          }}
        >
          {videoTitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
