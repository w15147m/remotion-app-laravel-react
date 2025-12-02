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

  const durationInFrames = useMemo(
    () => Math.round(durationInSeconds * COMPOSITION_FPS),
    [durationInSeconds]
  );

  const inputProps = useMemo(
    (): z.infer<typeof CompositionProps> => ({
      title: text,
      durationInSeconds,
      audioFileName,
      cardsData,
    }),
    [text, durationInSeconds, audioFileName, cardsData]
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
            compositionId="Shorts"
          />
        </div>
      </div>
    </div>
  );
}
