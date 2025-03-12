import * as esbuild from "esbuild-wasm";

import { AsyncEsBuild } from "./plugins/esbuild";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let esBuildRef: typeof esbuild;

interface bundleResult {
  code: string;
  err: string;
}

const bundle = async (rawCode: string): Promise<bundleResult> => {
  if (!esBuildRef) esBuildRef = await AsyncEsBuild.getInstance();

  try {
    const result = await esBuildRef.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": "'production'",
        global: "window",
      },
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });

    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        code: "",
        err: err.message,
      };
    }

    throw err;
  }
};

export default bundle;
