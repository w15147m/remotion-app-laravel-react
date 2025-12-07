import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

interface CarouselItem {
  id: number;
  content: React.ReactNode;
}

interface CarouselAnimationProps {
  items: CarouselItem[];
  rotationDuration?: number; // Duration in seconds for each rotation
  videoTitle?: string; // Optional video title to display at bottom
}

export const CarouselAnimation: React.FC<CarouselAnimationProps> = ({
  items,
  rotationDuration = 3,
  videoTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Auto-rotate based on duration
  const framesPerRotation = fps * rotationDuration;
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
    // Base styles for each level - MAXIMIZED HEIGHT FOR VIDEO
    const levelStyles = {
      '-2': { height: 750, width: 550, left: 1300, opacity: 0.6, zIndex: 1 },
      '-1': { height: 880, width: 635, left: 1000, opacity: 0.8, zIndex: 2 },
      '0': { height: 950, width: 730, left: 600, opacity: 1, zIndex: 3 },
      '1': { height: 880, width: 635, left: 253, opacity: 0.8, zIndex: 2 },
      '2': { height: 750, width: 550, left: -40, opacity: 0.6, zIndex: 1 },
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
          width: "1810px",
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
                opacity: style.opacity,
                zIndex: style.zIndex,
                // Smooth transitions
                transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "transform, opacity",
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
            color: "#228291",
            fontSize: "48px",
            fontFamily: "'Lobster', cursive",
            fontWeight: "bold",
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            padding: "0 40px",
          }}
        >
          {videoTitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
