import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllersDir = path.resolve(__dirname, "../../src/controllers");

const getControllerFiles = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getControllerFiles(entryPath);
    }

    return entry.name.endsWith(".js") ? [entryPath] : [];
  });
};

describe("controller modules", () => {
  const controllerFiles = getControllerFiles(controllersDir);

  it("has controller files to test", () => {
    expect(controllerFiles.length).toBeGreaterThan(0);
  });

  it.each(controllerFiles.map((file) => [path.relative(controllersDir, file), file]))(
    "%s exports at least one controller function",
    async (name, file) => {
      const controllerModule = await import(pathToFileURL(file).href);
      const exportedFunctions = Object.values(controllerModule).filter(
        (value) => typeof value === "function",
      );

      expect(exportedFunctions.length).toBeGreaterThan(0);
    },
  );
});
