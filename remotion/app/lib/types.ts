export type StatusResponse = {
  renderId: string;
  done: boolean;
  overallProgress: number;
  outputFile: string | null;
  errors: string[];
};

export type RenderResponse = {
  outputPath: string;
  fileName: string;
};
