import { z } from "zod";
import React from "react";
import { AlignEnd } from "../../layout/AlignEnd";
import { Button } from "../../ui/Button";
import { InputContainer } from "../../ui/InputContainer";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "../../ui/Error";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { ProgressBar } from "../../ui/ProgressBar";
import { Spacing } from "../../layout/Spacing";
import { useRendering } from "../../../lib/use-rendering";
import { COMPOSITION_ID } from "~/remotion/constants.mjs";
import { CompositionProps } from "~/remotion/schemata";
import { calculateOptimalSpeed, DEFAULT_FPS } from "../../../lib/motion-utils";


const AUDIO_OPTIONS = [
  { label: "None (No Audio)", value: "" },
  { label: "Deep", value: "deep.mp3" },
  { label: "Future", value: "future.mp3" },
  { label: "Gorila", value: "gorila.mp3" },
  { label: "Relaxing", value: "relaxing.mp3" },
];

const ANIMATION_OPTIONS = [
  { label: "3D Depth Carousel", value: "carousel" },
  { label: "5-Position Circular", value: "circular" },
  { label: "Smooth Easing Scroll", value: "easing" },
  { label: "Ice Cream App Demo", value: "ice-cream" },
];

const CARD_STYLE_OPTIONS = [
  { label: "Premium (Player Stats)", value: "player-stats" },
  { label: "Image & Stats (Clean)", value: "image-stats" },
  { label: "Full Image (Immersive)", value: "full-image" },
];

export const RenderControls: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  durationInSeconds: number;
  setDurationInSeconds: React.Dispatch<React.SetStateAction<number>>;
  audioFileName: string;
  setAudioFileName: ((value: string) => void) | React.Dispatch<React.SetStateAction<string>>;
  animationType: string;
  setAnimationType: ((value: string) => void) | React.Dispatch<React.SetStateAction<string>>;
  animationSpeed: number;
  setAnimationSpeed: (value: number) => void;
  fps: number;
  setFps: (value: number) => void;
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
  cardHeight: number | string;
  setCardHeight: (value: number | string) => void;
  cardWidth: number | string;
  setCardWidth: (value: number | string) => void;
  inputProps: z.infer<typeof CompositionProps>;
  compositionId?: string;
  cardStyle: string;
  setCardStyle: ((value: string) => void) | React.Dispatch<React.SetStateAction<string>>;
}> = ({ text, setText, durationInSeconds, setDurationInSeconds, audioFileName, setAudioFileName, animationType, setAnimationType, animationSpeed, setAnimationSpeed, fps, setFps, backgroundColor, setBackgroundColor, cardHeight, setCardHeight, cardWidth, setCardWidth, inputProps, compositionId = COMPOSITION_ID, cardStyle, setCardStyle }) => {
  const { renderMedia, state, undo } = useRendering(compositionId, inputProps);
  const [durationText, setDurationText] = React.useState(durationInSeconds.toString());
  const [cardHeightText, setCardHeightText] = React.useState(cardHeight.toString());
  const [cardWidthText, setCardWidthText] = React.useState(cardWidth.toString());

  const handleDurationChange = (value: string) => {
    setDurationText(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setDurationInSeconds(num);
    }
  };

  const handleCardHeightChange = (value: string) => {
    setCardHeightText(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setCardHeight(num);
    } else {
      setCardHeight(value);
    }
  };

  const handleCardWidthChange = (value: string) => {
    setCardWidthText(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setCardWidth(num);
      // Auto-calculate speed based on the new width
      const optimalSpeed = calculateOptimalSpeed(num);
      setAnimationSpeed(optimalSpeed);
    } else {
      setCardWidth(value);
    }
  };

  // Set FPS to default
  React.useEffect(() => {
    setFps(DEFAULT_FPS);
  }, [setFps]);

  return (
    <InputContainer>
      <div className="flex flex-row gap-4">
        <div className="mb-2 flex-1">
          <label className="block text-sm font-medium text-foreground opacity-80 mb-1">
            Video Title
          </label>
          <Input
            disabled={state.status === "invoking" || state.status === "rendering" || state.status === "done"}
            setText={setText}
            text={text}
          ></Input>
        </div>
        <div className="mb-2 flex-1">
          <label className="block text-sm font-medium text-foreground opacity-80 mb-1">
            Duration (seconds)
          </label>
          <Input
            disabled={state.status === "invoking" || state.status === "rendering" || state.status === "done"}
            setText={handleDurationChange}
            text={durationText}
          ></Input>
        </div>
        <div className="mb-2 flex-1">
          <label className="block text-sm font-medium text-foreground opacity-80 mb-1">
            Background Audio
          </label>
          <Select
            disabled={state.status === "invoking" || state.status === "rendering" || state.status === "done"}
            onChange={setAudioFileName}
            value={audioFileName}
            options={AUDIO_OPTIONS}
          ></Select>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="mb-2 flex-1">
          <label className="block text-sm font-medium text-foreground opacity-80 mb-1">
            Animation Type
          </label>
          <span className="sr-only">Animation Type Selection</span>
          <Select
            disabled={state.status === "invoking" || state.status === "rendering" || state.status === "done"}
            onChange={setAnimationType}
            value={animationType}
            options={ANIMATION_OPTIONS}
          ></Select>
        </div>
        <div className="mb-2 flex-1">
          <label className="block text-sm font-medium text-foreground opacity-80 mb-1">
            Card Style
          </label>
          <Select
            disabled={state.status === "invoking" || state.status === "rendering" || state.status === "done"}
            onChange={setCardStyle}
            value={cardStyle}
            options={CARD_STYLE_OPTIONS}
          ></Select>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="mb-2 flex-1">
          <label className="block text-sm font-medium text-foreground opacity-80 mb-1">
            Background Color
          </label>
          <Input
            disabled={state.status === "invoking" || state.status === "rendering" || state.status === "done"}
            setText={setBackgroundColor}
            text={backgroundColor}
          ></Input>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="mb-2 flex-1">
          <label className="block text-sm font-medium text-foreground opacity-80 mb-1">
            Card Height
          </label>
          <Input
            disabled={state.status === "invoking" || state.status === "rendering" || state.status === "done"}
            setText={handleCardHeightChange}
            text={cardHeightText}
          ></Input>
        </div>
        <div className="mb-2 flex-1">
          <label className="block text-sm font-medium text-foreground opacity-80 mb-1">
            Card Width
          </label>
          <Input
            disabled={state.status === "invoking" || state.status === "rendering" || state.status === "done"}
            setText={handleCardWidthChange}
            text={cardWidthText}
          ></Input>
        </div>
      </div>

      <Spacing></Spacing>

      {state.status === "init" || state.status === "invoking" || state.status === "error" ? (
        <>
          <AlignEnd>
            <Button
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={renderMedia}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === "error" ? (
            <ErrorComp message={state.error.message}></ErrorComp>
          ) : null}
        </>
      ) : null}

      {state.status === "rendering" ? (
        <>
          <ProgressBar progress={0.5} />
          <Spacing></Spacing>
          <div className="text-sm text-foreground opacity-60">
            Rendering your video...
          </div>
        </>
      ) : null}

      {state.status === "done" ? (
        <>
          <ProgressBar progress={1} />
          <Spacing></Spacing>
          <AlignEnd>
            <DownloadButton undo={undo} state={state}></DownloadButton>
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
