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

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
      durationInSeconds,
      audioFileName: audioFileName || undefined,
      cardsData: cardsData,
    };
  }, [text, durationInSeconds, audioFileName, cardsData]);

  const durationInFrames = useMemo(() => {
    return Math.round(durationInSeconds * COMPOSITION_FPS);
  }, [durationInSeconds]);

  return (
    <div className="max-w-screen-md m-auto mb-5">
      <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-5 ">
        <Player
          key={`player-${audioFileName}`}
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
        inputProps={inputProps}
      ></RenderControls>

    </div>
  );
}
