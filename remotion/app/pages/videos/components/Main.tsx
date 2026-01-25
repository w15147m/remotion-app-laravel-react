import { z } from "zod";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  Loop,
  useVideoConfig,
} from "remotion";
import React from "react";
import { CompositionProps } from "../../../remotion/schemata";
import { HorizontalScroll } from "./components/HorizontalScroll";
import { audioDurations } from "../../../remotion/audioData";

const container: React.CSSProperties = {
  backgroundColor: "white",
};


export const Main = ({ title, audioFileName, cardsData, videoTitle, animationType, animationSpeed, backgroundColor, cardHeight, cardWidth, cardStyle }: z.infer<typeof CompositionProps>) => {
  const { fps } = useVideoConfig();

  const dynamicContainer: React.CSSProperties = {
    ...container,
    backgroundColor: backgroundColor || "white",
  };

  return (
    <AbsoluteFill style={dynamicContainer}>
      {audioFileName && (
        <Loop durationInFrames={Math.ceil((audioDurations[audioFileName] || 10) * fps)}>
          <Audio src={staticFile(`audio/${audioFileName}`)} volume={1} />
        </Loop>
      )}
      <HorizontalScroll
        cardsData={cardsData}
        videoTitle={videoTitle}
        animationType={animationType}
        animationSpeed={animationSpeed}
        cardHeight={cardHeight}
        cardWidth={cardWidth}
        cardStyle={cardStyle}
      />
    </AbsoluteFill>
  );
};
