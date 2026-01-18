import { Player } from "@remotion/player";
import { useMemo, useState, useEffect } from "react";
import { COMPOSITION_FPS } from "../../remotion/constants.mjs";
import { z } from "zod";
import { Main } from "./components/Main.js";
import { RenderControls } from "../../components/features/rendering/RenderControls.js";

import { CompositionProps, GenericCardData } from "../../remotion/schemata.js";
import { videoItems } from "../../data/data.js";

export default function Index() {
  const [text, setText] = useState("React Router + Remotion");
  const [durationInSeconds, setDurationInSeconds] = useState(7);

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

  const [audioFileName, setAudioFileName] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("audioFileName") || "deep.mp3";
    }
    return "deep.mp3";
  });

  // Load cards data from sessionStorage
  const [cardsData, setCardsData] = useState<z.infer<typeof GenericCardData>[]>(
    () => {
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
    },
  );

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

  // Save audioFileName to sessionStorage when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("audioFileName", audioFileName);
    }
  }, [audioFileName]);

  const handleAnimationTypeChange = (value: string) => {
    setAnimationType(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("animationType", value);
    }
  };

  const handleAnimationSpeedChange = (value: number) => {
    setAnimationSpeed(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("animationSpeed", value.toString());
    }
  };

  // Handlers
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

  const durationInFrames = useMemo(
    () => Math.round(durationInSeconds * COMPOSITION_FPS),
    [durationInSeconds]
  );

  const inputProps = useMemo(
    (): z.infer<typeof CompositionProps> => ({
      title: text,
      durationInSeconds,
      audioFileName,
      animationType: animationType as "carousel" | "circular" | "linear",
      animationSpeed,
      cardsData,
      fps,
      backgroundColor,
      cardHeight,
      cardWidth,
    }),
    [text, durationInSeconds, audioFileName, animationType, animationSpeed, cardsData, fps, backgroundColor, cardHeight, cardWidth]
  );

  return (
    <div className="flex flex-col gap-geist">
      <div className="flex flex-col items-start gap-geist-half lg:flex-row">
        <div className="flex max-w-[360px] min-w-[360px] flex-col gap-geist-half">
          <Player
            key={`player-${audioFileName}`}
            component={Main}
            inputProps={inputProps}
            durationInFrames={durationInFrames}
            fps={COMPOSITION_FPS}
            compositionHeight={1920}
            compositionWidth={1080}
            style={{
              width: "100%",
            }}
            controls
            loop
          />
        </div>
        <div className="ml-10 m-auto">
          <RenderControls
            text={text}
            setText={setText}
            durationInSeconds={durationInSeconds}
            setDurationInSeconds={setDurationInSeconds}
            inputProps={inputProps}
            audioFileName={audioFileName}
            setAudioFileName={setAudioFileName}
            animationType={animationType}
            setAnimationType={handleAnimationTypeChange}
            animationSpeed={animationSpeed}
            setAnimationSpeed={handleAnimationSpeedChange}
            compositionId="Shorts"
            fps={fps}
            setFps={handleFpsChange}
            backgroundColor={backgroundColor}
            setBackgroundColor={handleBackgroundColorChange}
            cardHeight={cardHeight}
            setCardHeight={handleCardHeightChange}
            cardWidth={cardWidth}
            setCardWidth={handleCardWidthChange}
          />
        </div>
      </div>
    </div>
  );
}
