import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
  GenericCard,
  GenericCardData,
} from "../../../../components/cards/GenericCard";

interface HorizontalScrollProps {
  cardsData?: GenericCardData[];
  videoTitle?: string;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  cardsData = [],
  videoTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // FIX: "Too Fast"
  // Instead of a Physics Spring (which finishes in ~1-2 seconds),
  // We use the ENTIRE duration of the video clip to scroll.
  // This ensures it moves as slowly as possible while still showing everything.

  // 1. delayed start to let the viewer settle
  const delay = 15;
  const activeFrame = Math.max(0, frame - delay);
  const duration = Math.max(1, durationInFrames - delay - 30); // Buffer at end

  // 2. The scroll animation
  // We want to scroll from 0 to roughly end of content
  // We estimate width again, or just scroll a significant amount
  const progress = interpolate(
    activeFrame,
    [0, duration],
    [0, 1],
    {
      // "Cinematic" Easing: Starts slow, moves steady, stops slow.
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Calculate distance
  const totalWidthEstimate = 1800 + (cardsData.length * 600);
  // We scroll until the end, leaving some margin
  const scrollDistance = totalWidthEstimate - 1200;

  const xScroll = progress * -scrollDistance;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a4d4e 0%, #1a1a2e 100%)",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: "100px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          // Hardware Accelerated Layer
          transform: `translateX(${xScroll}px) translateZ(0)`,
          willChange: "transform",
        }}
      >
        {/* Title Group - Staggers in slightly differently? No, keep it simple and solid for now. */}
        <div
          style={{
            minWidth: "1720px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "40px",
          }}
        >
          <h1
            style={{
              color: '#ff9000',
              fontSize: "154px",
              textAlign: "center",
              fontFamily: "cursive",
              fontWeight: "bolder",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            {videoTitle}
          </h1>
        </div>

        {/* Cards */}
        {cardsData.map((cardData, cardIndex) => (
          <div
            key={cardIndex}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "80px",
            }}
          >
            <GenericCard data={cardData} index={cardIndex} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
