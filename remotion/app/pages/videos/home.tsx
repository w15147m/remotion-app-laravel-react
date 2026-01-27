import { Player } from "@remotion/player";
import { useMemo, useState, useEffect } from "react";
import {
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
} from "../../remotion/constants.mjs";
import { z } from "zod";
import { Main } from "./components/Main.js";
import { RenderControls } from "../../components/features/rendering/RenderControls.js";

import { CompositionProps, GenericCardData } from "../../remotion/schemata.js";
import { videoItems } from "../../data/data.js";

export default function Index() {
  const [text, setText] = useState("React Router + Remotion");
  const [durationInSeconds, setDurationInSeconds] = useState(7);
  const [audioFileName, setAudioFileName] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("audioFileName") || "deep.mp3";
    }
    return "deep.mp3";
  });

  // Load cards data from sessionStorage
  const [cardsData, setCardsData] = useState<z.infer<typeof GenericCardData>[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("videoItems");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse videoItems from sessionStorage:", e);
        }
      }
    }
    return [];
  });

  // Load video title from sessionStorage
  const [videoTitle, setVideoTitle] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("videoTitle") || "";
    }
    return "";
  });

  // Load animation type from sessionStorage
  const [animationType, setAnimationType] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("animationType") || "carousel";
    }
    return "carousel";
  });

  // Load animation speed from sessionStorage
  const [animationSpeed, setAnimationSpeed] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("animationSpeed");
      return stored ? parseFloat(stored) : 3;
    }
    return 3;
  });

  const [fps, setFps] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("fps");
      return stored ? parseFloat(stored) : 30;
    }
    return 30;
  });

  const [backgroundColor, setBackgroundColor] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("backgroundColor") || "#ffffff";
    }
    return "#ffffff";
  });

  const [cardHeight, setCardHeight] = useState<number | string>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cardHeight");
      // Try parsing number
      const num = parseFloat(stored || "");
      if (!isNaN(num) && num > 0) return num;
      return stored || 600;
    }
    return 600;
  });

  const [cardWidth, setCardWidth] = useState<number | string>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cardWidth");
      // Try parsing number
      const num = parseFloat(stored || "");
      if (!isNaN(num) && num > 0) return num;
      return stored || 400;
    }
    return 400;
  });



  const [cardStyle, setCardStyle] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("cardStyle") || "player-stats";
    }
    return "player-stats";
  });

  // On mount, load data from data.js and save to sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("videoItems");
      if (!stored) {
        // First time: save data from data.js to sessionStorage
        sessionStorage.setItem("videoItems", JSON.stringify(videoItems));
        setCardsData(videoItems);
      }
    }
  }, []);

  const handleAudioChange = (value: string) => {
    setAudioFileName(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("audioFileName", value);
      window.location.reload();
    }
  };

  const handleAnimationTypeChange = (value: string) => {
    setAnimationType(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("animationType", value);
    }
  };

  // ... (restored handlers)
  const handleAnimationSpeedChange = (value: number) => {
    setAnimationSpeed(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("animationSpeed", value.toString());
    }
  };

  const handleFpsChange = (value: number) => {
    setFps(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fps", value.toString());
    }
  };

  const handleBackgroundColorChange = (value: string) => {
    setBackgroundColor(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("backgroundColor", value);
    }
  };

  const handleCardHeightChange = (value: number | string) => {
    setCardHeight(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cardHeight", value.toString());
    }
  };

  const handleCardWidthChange = (value: number | string) => {
    setCardWidth(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cardWidth", value.toString());
    }
  };

  const handleCardStyleChange = (value: string) => {
    setCardStyle(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cardStyle", value);
    }
  };

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
      durationInSeconds,
      audioFileName: audioFileName || undefined,
      cardsData: cardsData,
      videoTitle: videoTitle,
      animationType: animationType as "carousel" | "circular" | "easing" | "ice-cream",
      animationSpeed: animationSpeed,
      fps: fps,
      backgroundColor: backgroundColor,
      cardHeight: cardHeight,
      cardWidth: cardWidth,
      cardStyle: cardStyle as "player-stats" | "image-stats" | "full-image",
    };
  }, [text, durationInSeconds, audioFileName, cardsData, videoTitle, animationType, animationSpeed, fps, backgroundColor, cardHeight, cardWidth, cardStyle]);

  const durationInFrames = useMemo(() => {
    return Math.round(durationInSeconds * COMPOSITION_FPS);
  }, [durationInSeconds]);

  return (
    <div className="max-w-screen-md m-auto mb-5">
      <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-5 ">
        <Player
          key={`player-${audioFileName}-${animationType}-${cardStyle}`}
          component={Main}
          inputProps={inputProps}
          durationInFrames={durationInFrames}
          fps={COMPOSITION_FPS}
          compositionHeight={COMPOSITION_HEIGHT}
          compositionWidth={COMPOSITION_WIDTH}
          style={{
            width: "100%",
          }}
          controls
          loop
        />
      </div>
      <RenderControls
        text={text}
        setText={setText}
        durationInSeconds={durationInSeconds}
        setDurationInSeconds={setDurationInSeconds}
        audioFileName={audioFileName}
        setAudioFileName={handleAudioChange}
        animationType={animationType}
        setAnimationType={handleAnimationTypeChange}
        animationSpeed={animationSpeed}
        setAnimationSpeed={handleAnimationSpeedChange}
        inputProps={inputProps}
        fps={fps}
        setFps={handleFpsChange}
        backgroundColor={backgroundColor}
        setBackgroundColor={handleBackgroundColorChange}
        cardHeight={cardHeight}
        setCardHeight={handleCardHeightChange}
        cardWidth={cardWidth}
        setCardWidth={handleCardWidthChange}
        cardStyle={cardStyle}
        setCardStyle={handleCardStyleChange}
      ></RenderControls>

    </div>
  );
}
