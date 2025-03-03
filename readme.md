
```shell
# install lerna npm

$ npm install -g lerna@latest # the course uses lerna@3.22.1
$ lerna init

# or instead using 
$ npx lerna init



# When using lerna, we do not manually npm install modules, instead we use the command lerna add 
# example: 
#   lerna add express --scope=cli
#   lerna add commander --scope=cli


# ❯ lerna add commander --scope=cli is deprecated
# ❯ lerna add commander --scope=cli
# ERR! add The "add" command was removed by default in v7, and is no longer maintained.
# ERR! add Learn more about this change at https://lerna.js.org/docs/legacy-package-management

$ npm install commander -w cli

https://lerna.js.org/docs/legacy-package-management


# in local-api
$ npm install local-api -w cli

# in /cli
$ node index.js


# # adding support for typescript
# $ npx tsc --init

$ npm install typescript --save-dev -w local-api

$ npm install typescript --save-dev -w cli


# lerna add local-clent --scope=local-api
$ npm install local-client -w local-api









# refactoring package names
# to update the links when you change the names of the packages for example
# local-api to @notebook-app-inline-markdown-jscode-snippets/local-api
# we'll be running the lerna bootstrap

$ lerna bootstrap -- --legacy-peer-deps
ERR! bootstrap The "bootstrap" command was removed by default in v7, and is no longer maintained.
ERR! bootstrap Learn more about this change at https://lerna.js.org/docs/legacy-package-management



# link gave us the same error
$ lerna link --legacy-peer-deps
ERR! link The "link" command was removed by default in v7, and is no longer maintained.
ERR! link Learn more about this change at https://lerna.js.org/docs/legacy-package-management


Solution:
Since Lerna v7 removed bootstrap, you can manually install dependencies and link the packages using npm or yarn.

Using npm: In a Lerna monorepo, you can install all dependencies using:


$ npm install --legacy-peer-deps

Using yarn: If you are using Yarn, you can run:
Copy
yarn install --legacy-peer-deps

Explanation:
--legacy-peer-deps: This flag is used to install packages without attempting to automatically resolve peer dependencies, which is helpful if you're dealing with legacy or conflicting versions of peer dependencies.
To summarize:
lerna bootstrap has been deprecated in Lerna v7.
You should use lerna link for linking local packages or use npm install or yarn install to install dependencies, especially with the --legacy-peer-deps flag if needed.










# lerna add esbuild@0.8.26 --exact --dev --scope=notebook-app-inline-markdown-jscode-snippets

$ npm install esbuild@0.24.2 --save-dev --exact -w notebook-app-inline-markdown-jscode-snippets







Note: when you execute in your packages/cli, you will see the following warning message

$: npm run prepublishOnly

> notebook-app-inline-markdown-jscode-snippets@1.0.0 prepublishOnly
> esbuild src/index.ts --platform=node --outfile=dist/index.js --bundle --minify --define:process.env.NODE_ENV=\"production\"

▲ [WARNING] "@notebook-app-inline-markdown-jscode-snippets/local-client/dist/index.html" should be marked as external for use with "require.resolve" [require-resolve-not-external]

    ../local-api/dist/index.js:35:44:
      35 │ ...uire.resolve("@notebook-app-inline-markdown-jscode-snippets/local-client/d...
         ╵                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1 warning

  dist/index.js  953.8kb

⚡ Done in 41ms



to avoid this warning, add the local-client in your packages

  "dependencies": {
    "@notebook-app-inline-markdown-jscode-snippets/local-client": "^1.0.0"
  },

note: not working. the solution is adding a flag as this "--external:@notebook-app-inline-markdown-jscode-snippets/local-client" indicating this in the package

  "scripts": {
    "start": "tsc --watch --preserveWatchOutput",
    "prepublishOnly": "esbuild src/index.ts --platform=node --outfile=dist/index.js --bundle --minify --define:process.env.NODE_ENV=\\\"production\\\" --external:@notebook-app-inline-markdown-jscode-snippets/local-client"
  },



$ lerna publish --no-push


info cli using local version of lerna
lerna notice cli v8.2.0
lerna info current version 0.0.0
lerna info Assuming all packages changed
? Select a new version (currently 0.0.0)
  Patch (0.0.1)
  Minor (0.1.0)
❯ Major (1.0.0)
  Prepatch (0.0.1-alpha.0)
  Preminor (0.1.0-alpha.0)
  Premajor (1.0.0-alpha.0)
  Custom Prerelease
  Custom Version


```


