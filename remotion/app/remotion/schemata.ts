import { z } from "zod";

export const GenericCardData = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  icon: z.string().optional(),
  country: z.string().optional(),
  yearRange: z.string().optional(),
  label: z.string().optional(),
  rankNumber: z.number().optional(),
  rankLabel: z.string().optional(),
  mediaUrl: z.string().optional(),
});

export const CompositionProps = z.object({
  title: z.string(),
  durationInSeconds: z.number().positive(),
  audioFileName: z.string().optional(),
  cardsData: z.array(GenericCardData).optional(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "React Router and Remotion",
  durationInSeconds: 7,
  audioFileName: "deep.mp3",
  cardsData: [],
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
