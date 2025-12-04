import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
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
  const { durationInFrames } = useVideoConfig();
  const [isClient, setIsClient] = React.useState(false);

  // Ensure client-side rendering to avoid hydration mismatch
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const numberOfScreens = (cardsData.length || 0) + 1;

  // Scroll speed: move to show all screens within duration
  // We want to end with the last screen visible.
  // The total width is numberOfScreens * 100% of the parent.
  // We want to shift by (numberOfScreens - 1) screens.
  // In percentage of the element width, that is (numberOfScreens - 1) / numberOfScreens * 100.
  const totalScrollPercent = ((numberOfScreens - 1) / numberOfScreens) * 100;
  const speedPerFrame = totalScrollPercent / durationInFrames;

  const xPercent = -frame * speedPerFrame;

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <AbsoluteFill
        style={{
          background: "linear-gradient(135deg, #0a4d4e 0%, #1a1a2e 100%)",
        }}
      />
    );
  }

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a4d4e 0%, #1a1a2e 100%)",
        flexDirection: "row",
        transform: `translateX(${xPercent}%)`,
        width: `${numberOfScreens * 100}%`,
      }}
    >
      <div
        style={{
          height: "100%",
          width: "1720px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
          padding: "40px",
          position: "relative",
          marginLeft: "40px",
        }}
      >
        <h1
          style={{
            color: '#ff9000',
            width: "1400px",
            textWrap: "auto",
            fontSize: "154px",
            textAlign: "center",
            fontFamily: "cursive",
            fontWeight: "bolder",
          }}
        >
          {videoTitle}
        </h1>
      </div>
      {cardsData.map((cardData, cardIndex) => (
        <div
          key={cardIndex}
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
            padding: "40px",
            position: "relative",
          }}
        >
          <GenericCard data={cardData} index={cardIndex} />
        </div>
      ))}
    </AbsoluteFill>
  );
};
