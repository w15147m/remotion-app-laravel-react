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
});

export const CompositionProps = z.object({
  title: z.string(),
  durationInSeconds: z.number().positive(),
  audioFileName: z.string().optional(),
  cardsData: z.array(GenericCardData).optional(),
  videoTitle: z.string().optional(),
  animationType: z.enum(["carousel", "circular"]).optional(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "React Router and Remotion",
  durationInSeconds: 7,
  audioFileName: "deep.mp3",
  cardsData: [],
  videoTitle: "",
  animationType: "carousel",
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
