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
}

export const CircularCarouselAnimation: React.FC<CircularCarouselAnimationProps> = ({
  items,
  rotationDuration = 2,
  videoTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const itemCount = items.length;
  // Calculate continuous progress
  // frame 0 -> 0
  // frame = rotationDuration * fps -> 1
  const framesPerItem = fps * rotationDuration;
  const progress = frame / framesPerItem;

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

          const opacity = interpolate(
            dist,
            range,
            [0, 0.5, 0.9, 1, 0.9, 0.5, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Spread out positions: 50 is center. 
          // 0 -> 50%
          // -1 -> 35%
          // 1 -> 65%
          // -2 -> 20%
          // 2 -> 80%
          const left = interpolate(
            dist,
            range,
            [50, 15, 30, 50, 70, 85, 50],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Width in px - gradual reduction
          const width = interpolate(
            dist,
            range,
            [200, 300, 400, 500, 400, 300, 200],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Height in px
          const height = interpolate(
            dist,
            range,
            [300, 400, 550, 700, 550, 400, 300],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Z-index - minimal layering needed if spread is wide, but good for overlap
          const zIndex = Math.round(interpolate(
            dist,
            range,
            [0, 1, 5, 10, 5, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ));

          // Translate X % - Standard centering (-50%) for all since we rely on `left` for positioning
          const translateX = "-50";

          // Translate Y % - Minimal curve
          const translateY = interpolate(
            dist,
            range,
            [0, 10, 5, 0, 5, 10, 0],
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
