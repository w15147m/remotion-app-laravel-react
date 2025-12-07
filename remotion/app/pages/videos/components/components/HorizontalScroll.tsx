import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const HorizontalScroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dummy data - 20 items for more variety
  const items = [
    { id: 1, color: "#FF6B6B", emoji: "🚀" },
    { id: 2, color: "#4ECDC4", emoji: "⭐" },
    { id: 3, color: "#45B7D1", emoji: "🎨" },
    { id: 4, color: "#FFA07A", emoji: "🎯" },
    { id: 5, color: "#98D8C8", emoji: "💎" },
    { id: 6, color: "#F7DC6F", emoji: "🔥" },
    { id: 7, color: "#A29BFE", emoji: "🎪" },
    { id: 8, color: "#FD79A8", emoji: "🌟" },
    { id: 9, color: "#FDCB6E", emoji: "⚡" },
    { id: 10, color: "#6C5CE7", emoji: "🎭" },
    { id: 11, color: "#FF85A2", emoji: "🎸" },
    { id: 12, color: "#74B9FF", emoji: "🌈" },
    { id: 13, color: "#A29BFE", emoji: "🎮" },
    { id: 14, color: "#FD79A8", emoji: "🏆" },
    { id: 15, color: "#55EFC4", emoji: "🌺" },
    { id: 16, color: "#FFEAA7", emoji: "🍕" },
    { id: 17, color: "#DFE6E9", emoji: "🎲" },
    { id: 18, color: "#00B894", emoji: "🌍" },
    { id: 19, color: "#E17055", emoji: "🎈" },
    { id: 20, color: "#0984E3", emoji: "🎁" },

  ];

  // Auto-rotate every 3 seconds (90 frames at 30fps, or 180 frames at 60fps)
  const framesPerRotation = fps * 3; // 3 seconds
  const currentRotation = Math.floor(frame / framesPerRotation);
  const activeIndex = currentRotation % items.length;

  // Progress within current rotation for smooth transitions
  const rotationProgress = (frame % framesPerRotation) / framesPerRotation;

  // Generate 5 visible items (level-2, level-1, level0, level1, level2)
  const generateVisibleItems = () => {
    const visibleItems = [];

    for (let i = -2; i <= 2; i++) {
      let index = activeIndex + i;

      // Handle wrapping
      if (index < 0) {
        index = items.length + index;
      } else if (index >= items.length) {
        index = index % items.length;
      }

      visibleItems.push({
        ...items[index],
        level: -i, // level-2, level-1, level0, level1, level2
        originalIndex: index,
      });
    }

    return visibleItems;
  };

  const visibleItems = generateVisibleItems();

  // Get card style based on level with smooth transitions
  const getCardStyle = (level: number) => {
    // Base styles for each level - OPTIMIZED FOR VIDEO (fits in frame)
    const levelStyles = {
      '-2': { height: 500, width: 367, left: 1300, opacity: 0.6, zIndex: 1 },
      '-1': { height: 600, width: 433, left: 1000, opacity: 0.8, zIndex: 2 },
      '0': { height: 650, width: 500, left: 600, opacity: 1, zIndex: 3 },
      '1': { height: 600, width: 433, left: 253, opacity: 0.8, zIndex: 2 },
      '2': { height: 500, width: 367, left: -40, opacity: 0.6, zIndex: 1 },
    };

    const currentStyle = levelStyles[level.toString() as keyof typeof levelStyles];

    if (!currentStyle) return levelStyles['2'];

    // Smooth transition between positions
    const transitionProgress = interpolate(
      rotationProgress,
      [0, 1],
      [0, 1],
      {
        easing: Easing.inOut(Easing.ease),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    return {
      ...currentStyle,
      transition: transitionProgress,
    };
  };

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #89FAD0 0%, #5FD3BC 100%)",
        overflow: "hidden",
        fontFamily: "'Lobster', cursive",
      }}
    >
      {/* Carousel Container */}
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "1600px",
          margin: "auto",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Render visible cards */}
        {visibleItems.map((item, idx) => {
          const style = getCardStyle(item.level);

          return (
            <div
              key={`${item.originalIndex}-${idx}`}
              style={{
                position: "absolute",
                height: `${style.height}px`,
                width: `${style.width}px`,
                left: `${style.left}px`,
                top: "50%",
                transform: "translateY(-50%)",
                background: item.color,
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: "40px",
                fontWeight: "bold",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                opacity: style.opacity,
                zIndex: style.zIndex,
                // Smooth transitions
                transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "transform, opacity",
              }}
            >
              <div style={{ fontSize: "200px", marginBottom: "30px" }}>
                {item.emoji}
              </div>
              <div style={{ fontSize: "110px", fontWeight: "bold" }}>
                {item.id}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
