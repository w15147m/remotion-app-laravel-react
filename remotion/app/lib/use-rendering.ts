import { z } from "zod";
import { useCallback, useMemo, useState } from "react";
import { renderVideo } from "./api";
import { CompositionProps } from "~/remotion/schemata";

export type State =
  | {
    status: "init";
  }
  | {
    status: "invoking";
  }
  | {
    status: "rendering";
  }
  | {
    status: "error";
    error: Error;
  }
  | {
    url: string;
    fileName: string;
    status: "done";
  };

export const useRendering = (
  id: string,
  inputProps: z.infer<typeof CompositionProps>,
) => {
  const [state, setState] = useState<State>({
    status: "init",
  });

  const renderMedia = useCallback(async () => {
    setState({
      status: "invoking",
    });
    try {
      setState({
        status: "rendering",
      });

      const result = await renderVideo({ inputProps, compositionId: id });

      setState({
        url: result.outputPath,
        fileName: result.fileName,
        status: "done",
      });
    } catch (err) {
      setState({
        status: "error",
        error: err as Error,
      });
    }
  }, [inputProps, id]);

  const undo = useCallback(() => {
    setState({ status: "init" });
  }, []);

  return useMemo(() => {
    return {
      renderMedia,
      state,
      undo,
    };
  }, [renderMedia, state, undo]);
};
