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
import { audioDurations } from "../../../remotion/audioData";
import { RemotionCarousel, RemotionCarouselCard } from "./components/RemotionCarousel";

const container: React.CSSProperties = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

export const Main = ({ title, audioFileName, cardsData }: z.infer<typeof CompositionProps>) => {
  const { fps } = useVideoConfig();

  // Use cardsData if available, otherwise show a placeholder
  const cards = cardsData && cardsData.length > 0 ? cardsData : [
    { title: "No Data", subtitle: "Add cards in the data editor" }
  ];

  return (
    <AbsoluteFill style={container}>
      {audioFileName && (
        <Loop durationInFrames={Math.ceil((audioDurations[audioFileName] || 10) * fps)}>
          <Audio src={staticFile(`audio/${audioFileName}`)} volume={1} />
        </Loop>
      )}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <RemotionCarousel transitionDuration={2}>
          {cards.map((card, i) => (
            <RemotionCarouselCard
              key={i}
              data={card}
            />
          ))}
        </RemotionCarousel>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
