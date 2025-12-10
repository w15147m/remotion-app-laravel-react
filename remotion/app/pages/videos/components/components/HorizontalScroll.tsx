import React from "react";
import { CircularCarouselAnimation } from "./components/CircularCarouselAnimation";
import { CarouselAnimation } from "./components/CarouselAnimation";
import { GenericCard, GenericCardData } from "../../../../components/cards/GenericCard";

interface HorizontalScrollProps {
  cardsData?: GenericCardData[];
  videoTitle?: string;
  animationType?: "carousel" | "circular";
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  cardsData = [],
  videoTitle,
  animationType = "carousel",
}) => {
  // Dummy data for preview
  const dummyData: GenericCardData[] = cardsData.length > 0 ? cardsData : [
    { title: "Card 1", subtitle: "Red", icon: "🔴", rankNumber: 1, rankLabel: "First" },
    { title: "Card 2", subtitle: "Orange", icon: "🟠", rankNumber: 2, rankLabel: "Second" },
    { title: "Card 3", subtitle: "Yellow", icon: "🟡", rankNumber: 3, rankLabel: "Third" },
    { title: "Card 4", subtitle: "Lime", icon: "🟢", rankNumber: 4, rankLabel: "Fourth" },
    { title: "Card 5", subtitle: "Green", icon: "🟢", rankNumber: 5, rankLabel: "Fifth" },
    { title: "Card 6", subtitle: "Cyan", icon: "🔵", rankNumber: 6, rankLabel: "Sixth" },
    { title: "Card 7", subtitle: "Blue", icon: "🔵", rankNumber: 7, rankLabel: "Seventh" },
    { title: "Card 8", subtitle: "Indigo", icon: "🟣", rankNumber: 8, rankLabel: "Eighth" },
    { title: "Card 9", subtitle: "Purple", icon: "🟣", rankNumber: 9, rankLabel: "Ninth" },
    { title: "Card 10", subtitle: "Pink", icon: "🩷", rankNumber: 10, rankLabel: "Tenth" },
  ];

  // Transform data into carousel items with GenericCard components
  const carouselItems = dummyData.map((cardData, index) => ({
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

  // Switch between animation types
  if (animationType === "circular") {
    return <CircularCarouselAnimation items={carouselItems} rotationDuration={2} videoTitle={videoTitle} />;
  }

  return <CarouselAnimation items={carouselItems} rotationDuration={3} videoTitle={videoTitle} />;
};
