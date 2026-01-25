import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Trail } from "@remotion/motion-blur";

interface EasingScrollItem {
  id: number;
  content: React.ReactNode;
}

interface EasingScrollAnimationProps {
  items: EasingScrollItem[];
  rotationDuration?: number;
  videoTitle?: string;
  cardWidth?: number | string;
}

export const EasingScrollAnimation: React.FC<EasingScrollAnimationProps> = ({
  items,
  rotationDuration = 3,
  videoTitle,
  cardWidth: cardWidthProp = 625,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardWidth = typeof cardWidthProp === 'string' ? parseFloat(cardWidthProp) : cardWidthProp;
  const gap = 20;
  const itemSpacing = cardWidth + gap;
  const framesPerItem = fps * rotationDuration;

  // Current "virtual" scroll position with easing
  const totalFrames = items.length * framesPerItem;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "hidden",
      }}
    >
      <Trail layers={4} lagInFrames={1} trailOpacity={1}>
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

            // Easing logic: 
            // We want the most deceleration right when the card is centered.
            // We interpolate the "progress" using an easing function.
            const easedProgress = interpolate(
              frame % totalFrames,
              items.map((_, i) => i * framesPerItem),
              items.map((_, i) => i),
              {
                easing: Easing.inOut(Easing.quad),
                extrapolateLeft: "extend",
                extrapolateRight: "extend",
              }
            );

            let dist = (index - easedProgress) % itemCount;
            if (dist < -itemCount / 2) dist += itemCount;
            if (dist > itemCount / 2) dist -= itemCount;

            const xOffset = dist * itemSpacing;

            const opacity = interpolate(
              Math.abs(dist),
              [0, 1.2, 2.2],
              [1, 1, 0],
              { extrapolateRight: "clamp" }
            );

            const scale = interpolate(
              Math.abs(dist),
              [0, 1],
              [1, 0.85],
              { extrapolateRight: "clamp" }
            );

            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: `${cardWidth}px`,
                  height: "90%",
                  transform: `translateX(calc(-50% + ${Math.round(xOffset)}px)) translateY(-50%) scale(${scale})`,
                  opacity,
                  zIndex: Math.round(100 - Math.abs(dist) * 10),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                }}
              >
                {item.content}
              </div>
            );
          })}
        </div>
      </Trail>

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
