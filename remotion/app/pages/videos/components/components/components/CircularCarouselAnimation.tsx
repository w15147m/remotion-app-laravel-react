import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

interface CircularCarouselItem {
  id: number;
  content: React.ReactNode;
}

interface CircularCarouselAnimationProps {
  items: CircularCarouselItem[];
  rotationDuration?: number;
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

  // Auto-rotate
  const framesPerRotation = fps * rotationDuration;
  const currentRotation = Math.floor(frame / framesPerRotation);
  const selectedIndex = currentRotation % itemCount;

  // Get position class for each item
  const getPositionClass = (index: number) => {
    const relativeIndex = (index - selectedIndex + itemCount) % itemCount;
    if (relativeIndex === 0) return "selected";
    if (relativeIndex === 1) return "next";
    if (relativeIndex === 2) return "nextRightSecond";
    if (relativeIndex === itemCount - 1) return "prev";
    if (relativeIndex === itemCount - 2) return "prevLeftSecond";
    return relativeIndex > 2 ? "hideRight" : "hideLeft";
  };

  // Get styles for each position
  const getPositionStyle = (positionClass: string) => {
    const baseStyle = {
      position: "absolute" as const,
      transition: "all 1s ease-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    switch (positionClass) {
      case "selected":
        return {
          ...baseStyle,
          left: "50%",
          transform: "translateY(0%) translateX(-50%)",
          width: "500px",
          height: "700px",
          zIndex: 10,
          opacity: 1,
        };
      case "next":
        return {
          ...baseStyle,
          left: "72%",
          transform: "translateY(0%) translateX(-50%)",
          width: "420px",
          height: "600px",
          zIndex: 5,
          opacity: 1,
        };
      case "prev":
        return {
          ...baseStyle,
          left: "28%",
          transform: "translateY(0%) translateX(-50%)",
          width: "420px",
          height: "600px",
          zIndex: 5,
          opacity: 1,
        };
      case "nextRightSecond":
        return {
          ...baseStyle,
          left: "60%",
          transform: "translateY(5%) translateX(-35%)",
          width: "350px",
          height: "500px",
          zIndex: 2,
          opacity: 0.7,
        };
      case "prevLeftSecond":
        return {
          ...baseStyle,
          left: "40%",
          transform: "translateY(5%) translateX(-65%)",
          width: "350px",
          height: "500px",
          zIndex: 2,
          opacity: 0.7,
        };
      default:
        return {
          ...baseStyle,
          opacity: 0,
          zIndex: 0,
          width: "300px",
          height: "400px",
        };
    }
  };

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
          const positionClass = getPositionClass(index);
          const style = getPositionStyle(positionClass);

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
