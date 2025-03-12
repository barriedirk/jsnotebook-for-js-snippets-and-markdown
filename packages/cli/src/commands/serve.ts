import { Command } from "commander";
import path from "path";

import { serve } from "@notebook-app-inline-markdown-jscode-snippets/local-api";

const isProduction = process.env.NODE_ENV === "production";

interface LocalApiError {
  code: string;
}

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run serve on", "4005")
  .action(async (filename = "workbook.json", options: { port: string }) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === "string";
    };

    try {
      const dir = path.join(process.cwd(), path.dirname(filename));

      await serve(
        parseInt(options.port, 10),
        path.basename(filename),
        dir,
        !isProduction
      );

      console.log(
        `Opened "file-list-notebooks-${filename}".\n\n Navigate to: \n\nhttp://localhost:${options.port}/\n\n to edit the file.\n\nIn this folder, the app will create some json files, one it's the list of the notebooks and the other is the notebook code/text`
      );
    } catch (err) {
      if (isLocalApiError(err)) {
        if (err.code === "EADDRINUSE") {
          console.error("Port is in use. Try running on a different port.");
        }
      } else if (err instanceof Error) {
        console.log("Heres the problem", err.message);
      }

      process.exit(1);
    }
  });
