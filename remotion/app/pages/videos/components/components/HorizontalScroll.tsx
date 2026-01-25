import React from "react";
import { CircularCarouselAnimation } from "./components/CircularCarouselAnimation";
import { CarouselAnimation } from "./components/CarouselAnimation";
import { LinearScrollAnimation } from "./components/LinearScrollAnimation";
import { EasingScrollAnimation } from "./components/EasingScrollAnimation";
import { PlayerStatsCard } from "../../../../components/cards/PlayerStatsCard";
import { ImageStatsCard } from "../../../../components/cards/ImageStatsCard";
import { FullImageCard } from "../../../../components/cards/FullImageCard";
import { GenericCardData } from "../../../../components/cards/GenericCard"; // Just type for now

interface HorizontalScrollProps {
  cardsData?: GenericCardData[];
  videoTitle?: string;
  animationType?: "carousel" | "circular" | "linear" | "easing";
  animationSpeed?: number;
  cardHeight?: number | string;
  cardWidth?: number | string;
  cardStyle?: "player-stats" | "image-stats" | "full-image";
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  cardsData = [],
  videoTitle,
  animationType = "carousel",
  animationSpeed = 3,
  cardHeight,
  cardWidth,
  cardStyle = "player-stats",
}) => {
  // Transform data into carousel items with appropriate card components
  const carouselItems = cardsData.map((cardData, index) => {
    let CardComponent = PlayerStatsCard; // Default to premium

    if (cardStyle === "image-stats") CardComponent = ImageStatsCard;
    if (cardStyle === "full-image") CardComponent = FullImageCard;

    return {
      id: index,
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardComponent data={cardData} width={cardWidth} height={cardHeight} />
        </div>
      ),
    };
  });

  // Switch between animation types
  if (animationType === "circular") {
    return <CircularCarouselAnimation items={carouselItems} rotationDuration={animationSpeed} videoTitle={videoTitle} cardWidth={cardWidth} />;
  }

  if (animationType === "linear") {
    return <LinearScrollAnimation items={carouselItems} rotationDuration={animationSpeed} videoTitle={videoTitle} cardWidth={cardWidth} />;
  }

  if (animationType === "easing") {
    return <EasingScrollAnimation items={carouselItems} rotationDuration={animationSpeed} videoTitle={videoTitle} cardWidth={cardWidth} />;
  }

  return <CarouselAnimation items={carouselItems} rotationDuration={animationSpeed} videoTitle={videoTitle} />;
};
