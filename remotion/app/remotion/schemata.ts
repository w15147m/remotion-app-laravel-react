import { z } from "zod";

export const GenericCardData = z.object({
  title: z.string().nullable(),
  subtitle: z.string().nullish(),
  icon: z.string().nullish(),
  country: z.string().nullish(),
  yearRange: z.string().nullish(),
  label: z.string().nullish(),
  rankNumber: z.number().nullish(),
  rankLabel: z.string().nullish(),
  mediaUrl: z.string().nullish(),
  extraInfo: z.string().nullish(),
});

export const CompositionProps = z.object({
  title: z.string(),
  durationInSeconds: z.number().positive(),
  audioFileName: z.string().optional(),
  cardsData: z.array(GenericCardData).optional(),
  videoTitle: z.string().optional(),
  animationType: z.enum(["carousel", "circular", "linear"]).optional(),
  animationSpeed: z.number().positive().optional(),
  fps: z.number().positive().optional(),
  backgroundColor: z.string().optional(),
  cardHeight: z.union([z.number(), z.string()]).optional(),
  cardWidth: z.union([z.number(), z.string()]).optional(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "React Router and Remotion",
  durationInSeconds: 7,
  audioFileName: "deep.mp3",
  cardsData: [],
  videoTitle: "",
  animationType: "carousel",
  animationSpeed: 3,
  fps: 30,
  backgroundColor: "#ffffff",
  cardHeight: 600,
  cardWidth: 400,
};


export const RenderRequest = z.object({
  inputProps: CompositionProps,
  compositionId: z.string(),
});

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

export type ProgressResponse =
  | {
    type: "error";
    message: string;
  }
  | {
    type: "progress";
    progress: number;
  }
  | {
    type: "done";
    url: string;
    size: number;
  };
