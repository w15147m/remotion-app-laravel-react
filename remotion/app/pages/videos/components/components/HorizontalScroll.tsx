import React from "react";
import { CircularCarouselAnimation } from "./components/CircularCarouselAnimation";
import { CarouselAnimation } from "./components/CarouselAnimation";
import { LinearScrollAnimation } from "./components/LinearScrollAnimation";
import { EasingScrollAnimation } from "./components/EasingScrollAnimation";
import { GenericCard, GenericCardData } from "../../../../components/cards/GenericCard";

interface HorizontalScrollProps {
  cardsData?: GenericCardData[];
  videoTitle?: string;
  animationType?: "carousel" | "circular" | "linear" | "easing";
  animationSpeed?: number;
  cardHeight?: number | string;
  cardWidth?: number | string;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  cardsData = [],
  videoTitle,
  animationType = "carousel",
  animationSpeed = 3,
  cardHeight,
  cardWidth,
}) => {
  // Transform data into carousel items with GenericCard components
  const carouselItems = cardsData.map((cardData, index) => ({
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
        <GenericCard data={cardData} index={index} width={cardWidth} height={cardHeight} />
      </div>
    ),
  }));

  // Switch between animation types
  if (animationType === "circular") {
    return <CircularCarouselAnimation items={carouselItems} rotationDuration={animationSpeed} videoTitle={videoTitle} />;
  }

  if (animationType === "linear") {
    return <LinearScrollAnimation items={carouselItems} rotationDuration={animationSpeed} videoTitle={videoTitle} cardWidth={cardWidth} />;
  }

  if (animationType === "easing") {
    return <EasingScrollAnimation items={carouselItems} rotationDuration={animationSpeed} videoTitle={videoTitle} cardWidth={cardWidth} />;
  }

  return <CarouselAnimation items={carouselItems} rotationDuration={animationSpeed} videoTitle={videoTitle} />;
};
