import * as esbuild from "esbuild-wasm";

// First version, it's failed because
// try to initialize the esbuild but it's not singleton pattern and when there were more than one
// code, the build for the second code is failed
export const startService = (() => {
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

export class AsyncEsBuild {
  static instance: typeof esbuild;
  static isLoading = false;

  static async initializeEsBuild() {
    await esbuild.initialize({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.24.2/esbuild.wasm",
    });

    return esbuild;
  }

  static async getInstance() {
    if (AsyncEsBuild.instance) {
      return AsyncEsBuild.instance;
    }

    if (AsyncEsBuild.isLoading) {
      while (AsyncEsBuild.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    AsyncEsBuild.isLoading = true;

    try {
      const result = await AsyncEsBuild.initializeEsBuild();

      AsyncEsBuild.instance = result;
    } catch (error) {
      console.error("Error initialize esbuild:", error);
    } finally {
      AsyncEsBuild.isLoading = false;
    }

    return AsyncEsBuild.instance;
  }
}
