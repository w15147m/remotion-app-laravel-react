import { z } from "zod";
import {
  CompositionProps,
  ProgressRequest,
  ProgressResponse,
  RenderRequest,
} from "~/remotion/schemata";
import { RenderResponse } from "./types";

export type ApiResponse<Res> =
  | {
    type: "error";
    message: string;
  }
  | {
    type: "success";
    data: Res;
  };

const makeRequest = async <Res>(
  endpoint: string,
  body: unknown,
): Promise<Res> => {
  const result = await fetch(endpoint, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });
  const json = (await result.json()) as ApiResponse<Res>;
  if (json.type === "error") {
    throw new Error(json.message);
  }

  return json.data;
};

export const renderVideo = async ({
  inputProps,
  compositionId,
}: {
  inputProps: z.infer<typeof CompositionProps>;
  compositionId: string;
}) => {
  const body: z.infer<typeof RenderRequest> = {
    inputProps,
    compositionId,
  };

  return makeRequest<RenderResponse>("/api/lambda/render", body);
};

export const getProgress = async ({
  id,
  bucketName,
}: {
  id: string;
  bucketName: string;
}) => {
  const body: z.infer<typeof ProgressRequest> = {
    id,
    bucketName,
  };

  return makeRequest<ProgressResponse>("/api/lambda/progress", body);
};

// ================================
// ✅ Login API Function
// ================================
export const loginPost = async <Res>(
  endpoint: string,
  body: unknown,
): Promise<Res> => {
  const result = await fetch(endpoint, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });

  if (!result.ok) {
    const errorData = await result.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${result.status}`);
  }

  return await result.json();
};
