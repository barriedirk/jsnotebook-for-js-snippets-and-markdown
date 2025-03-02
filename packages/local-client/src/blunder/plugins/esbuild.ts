import * as esbuild from "esbuild-wasm";

const startService = (() => {
  let esBuildRef: typeof esbuild;

  return async () => {
    if (esBuildRef) {
      return esBuildRef;
    } else {
      await esbuild.initialize({
        worker: true,
        // wasmURL: "/esbuild.wasm", // to remove esbuild.wasm from your public folder
        wasmURL: "https://unpkg.com/esbuild-wasm@0.24.2/esbuild.wasm",
      });

      esBuildRef = esbuild;

      return esBuildRef;
    }
  };
})();

export default startService;
