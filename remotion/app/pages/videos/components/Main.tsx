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

export const Main = ({ title, audioFileName, cardsData, videoTitle, animationType }: z.infer<typeof CompositionProps>) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={container}>
      {audioFileName && (
        <Loop durationInFrames={Math.ceil((audioDurations[audioFileName] || 10) * fps)}>
          <Audio src={staticFile(`audio/${audioFileName}`)} volume={1} />
        </Loop>
      )}
      <HorizontalScroll cardsData={cardsData} videoTitle={videoTitle} animationType={animationType} />
    </AbsoluteFill>
  );
};
