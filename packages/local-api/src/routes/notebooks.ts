import express from "express";
import fs from "fs/promises";
import path from "path";

import { PREFIX_FILE } from "../utils/constants";

export interface Notebook {
  title: string;
  fileId: string;
}

export interface FilesNotebook {
  activeFileId?: string | null;
  files: Notebook[];
}

interface LocalApiError {
  code: string;
}

const emptyFilesNotebook: FilesNotebook = {
  activeFileId: undefined,
  files: [],
};

const emptyJsonStringify = JSON.stringify(emptyFilesNotebook);

const isLocalApiError = (err: any): err is LocalApiError => {
  return typeof err.code === "string";
};

export const createFileNotebooksRouter = (filename: string, dir: string) => {
  const fullPath = path.join(dir, "file-list-notebooks-" + filename);
  const router = express.Router();

  router.use(express.json());

  router.get("/filenotebooks", async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });

      if (!result) {
        res.send(emptyFilesNotebook);

        return;
      }

      res.send(JSON.parse(result ?? emptyJsonStringify));
    } catch (err) {
      // if read throws an error
      // Inspect the error, see if it says that the file doesn't exist
      if (isLocalApiError(err)) {
        if (err.code === "ENOENT") {
          // Add code to create a file and add default cells
          await fs.writeFile(fullPath, emptyJsonStringify, "utf-8");

          res.send(emptyFilesNotebook);
        }
      } else {
        throw err;
      }
    }
  });

  router.post("/filenotebooks", async (req, res) => {
    const filesNotebook: FilesNotebook = req.body;
    const deleteFileId = req.headers["deletefileid"];

    if (!filesNotebook) {
      res.status(404).send({ status: "failed" });

      return;
    }

    // Write the filenotebook into the file
    await fs.writeFile(fullPath, JSON.stringify(filesNotebook), "utf-8");

    if (deleteFileId) {
      const removeFilePath = path.join(
        dir,
        `${PREFIX_FILE}-${deleteFileId}-${filename}`
      );

      await fs.unlink(removeFilePath);
    }

    res.send({ status: "ok" });
  });

  return router;
};
