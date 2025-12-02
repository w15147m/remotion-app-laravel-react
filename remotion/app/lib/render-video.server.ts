import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import type { RenderResponse } from "./types";
import { z } from "zod";
import { CompositionProps } from "~/remotion/schemata";
import path from "path";
import fs from "fs";

export const renderVideo = async ({
  composition,
  inputProps,
  outName,
}: {
  composition: string;
  inputProps: z.infer<typeof CompositionProps>;
  outName: string;
}): Promise<RenderResponse> => {
  // Create output directory if it doesn't exist
  const outputDir = path.join(process.cwd(), "public", "videos");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, outName);

  // Bundle the Remotion project
  const bundleLocation = await bundle({
    entryPoint: path.join(process.cwd(), "app", "remotion", "index.ts"),
    // If you have a Webpack override, make sure to import it here
    webpackOverride: (config) => config,
  });

  // Get composition metadata
  const compositionData = await selectComposition({
    serveUrl: bundleLocation,
    id: composition,
    inputProps,
  });

  // Render the video
  await renderMedia({
    composition: compositionData,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
  });

  return {
    outputPath: `/videos/${outName}`,
    fileName: outName,
  };
};
