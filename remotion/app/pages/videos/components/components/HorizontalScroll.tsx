import React from "react";
import { CarouselAnimation } from "./components/CarouselAnimation";
import { GenericCard, GenericCardData } from "../../../../components/cards/GenericCard";

interface HorizontalScrollProps {
  cardsData?: GenericCardData[];
  videoTitle?: string;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  cardsData = [],
  videoTitle,
}) => {
  // Transform cardsData into carousel items with GenericCard components
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
        <GenericCard data={cardData} index={index} />
      </div>
    ),
  }));

  return <CarouselAnimation items={carouselItems} rotationDuration={3} videoTitle={videoTitle} />;
};
