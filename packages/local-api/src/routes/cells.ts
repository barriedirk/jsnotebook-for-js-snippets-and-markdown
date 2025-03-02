import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

interface LocalApiError {
  code: string;
}

const isLocalApiError = (err: any): err is LocalApiError => {
  return typeof err.code === "string";
};

export const createCellsRouter = (filename: string, dir: string) => {
  const fullPath = path.join(dir, filename);
  const router = express.Router();

  router.use(express.json());

  router.get("/cells", async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });

      if (!result) {
        res.send([]);

        return;
      }

      // Parse a list of cells out of it
      // Send list of cells back to browser
      res.send(JSON.parse(result ?? "[]"));
    } catch (err) {
      // if read throws an error
      // Inspect the error, see if it says that the file doesn't exist
      if (isLocalApiError(err)) {
        if (err.code === "ENOENT") {
          // Add code to create a file and add default cells
          await fs.writeFile(fullPath, "[]", "utf-8");

          res.send([]);
        }
      } else {
        throw err;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    // Take the list of cells from the request obk
    // serialize them
    const { cells }: { cells: Cell[] } = req.body;

    if (!cells) {
      res.send({ status: "failed" });

      return;
    }

    console.log("cells", cells);

    // Write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });

  return router;
};
