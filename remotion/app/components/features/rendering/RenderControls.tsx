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
  { label: "Linear Scroll", value: "linear" },
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
  inputProps: z.infer<typeof CompositionProps>;
  compositionId?: string;
}> = ({ text, setText, durationInSeconds, setDurationInSeconds, audioFileName, setAudioFileName, animationType, setAnimationType, inputProps, compositionId = COMPOSITION_ID }) => {
  const { renderMedia, state, undo } = useRendering(compositionId, inputProps);
  const [durationText, setDurationText] = React.useState(durationInSeconds.toString());

  const handleDurationChange = (value: string) => {
    setDurationText(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setDurationInSeconds(num);
    }
  };

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
      <div className="mb-2">
        <label className="block text-sm font-medium text-foreground opacity-80 mb-1">
          Animation Type
        </label>
        <Select
          disabled={state.status === "invoking" || state.status === "rendering" || state.status === "done"}
          onChange={setAnimationType}
          value={animationType}
          options={ANIMATION_OPTIONS}
        ></Select>
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
