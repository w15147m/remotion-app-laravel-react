import { ActionFunctionArgs } from "react-router";
import { renderVideo } from "../../lib/render-video.server";
import { RenderRequest, CompositionProps } from "../../remotion/schemata";
import type { ApiResponse } from "../../lib/api";
import type { RenderResponse } from "../../lib/types";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const { inputProps, compositionId } = RenderRequest.parse(body);

    // Validate input props
    CompositionProps.parse(inputProps);

    // Generate a filename based on the title
    const timestamp = Date.now();
    const sanitizedTitle = inputProps.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const fileName = `${sanitizedTitle}-${timestamp}.mp4`;

    const result = await renderVideo({
      composition: compositionId,
      inputProps,
      outName: fileName,
    });

    const response: ApiResponse<RenderResponse> = {
      type: "success",
      data: result,
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const response: ApiResponse<never> = {
      type: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
