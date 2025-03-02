/* eslint-disable @typescript-eslint/no-explicit-any */

/* 

https://unpkg.com/

example:
https://unpkg.com/react@19.0.0/index.js

'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.js');
} else {
  module.exports = require('./cjs/react.development.js');
}


// packages to test
https://unpkg.com/tiny-test-pkg
https://unpkg.com/medium-test-pkg
https://unpkg.com/nested-test-pkg

----

https://unpkg.com/tiny-test-pkg@1.0.0/index.js
module.exports = 'hi there!';


https://unpkg.com/medium-test-pkg@1.0.0/index.js
const toUpperCase = require('./utils');

const message = 'hi there';

module.exports = toUpperCase(message);


https://unpkg.com/nested-test-pkg
const toUpperCase = require('./helpers/utils');

const message = 'hi there';

module.exports = toUpperCase(message);


*/

import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }

        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path,
        );

        if (cachedResult) return cachedResult;

        // a. looking for a path to the index.js
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
