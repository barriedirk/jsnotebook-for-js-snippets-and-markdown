import express from "express";
import path from "path";

import { createProxyMiddleware } from "http-proxy-middleware";

import { createCellsRouter } from "./routes/cells";
import { createFileNotebooksRouter } from "./routes/notebooks";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));
  app.use(createFileNotebooksRouter(filename, dir));

  // two ways to call react app
  if (useProxy) {
    // two: redirect to the url where the react app is running:
    // Use this version is you actively developint our app on our local machine, use proxy to local CRA dev server
    // app.use(
    //   createProxyMiddleware({
    //     target: "http://localhost:5173/",
    //     secure: false,
    //     ws: true,
    //     logger: console,
    //   })
    // );
    app.use(
      createProxyMiddleware({
        target: "http://localhost:5173/",
        secure: false,
        ws: true,
      })
    );
  } else {
    // one is install a reference for your local package local-client and add the path for dist
    // are we running our app on a user's machine: server up built files from build/dist dir
    const packagePath = require.resolve(
      "@notebook-app-inline-markdown-jscode-snippets/local-client/dist/index.html"
    );

    app.use(express.static(path.dirname(packagePath)));

    // it is not a solution, it's a proof of concept
    // app.use(express.static("../../local-client/dist"));
  }

  return new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve();
    });

    server.on("error", (error) => {
      reject(error);
    });
  });
};
