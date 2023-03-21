import { FileName, ReadMapFileResult } from "./types.ts";

const MAPFILE_NAMES: FileName[] = ["import_map.json", "deps.ts", "dev_deps.ts"];

export const readMapFiles = async (
  root = "./",
): Promise<ReadMapFileResult[]> => {
  const result: ReadMapFileResult[] = [];

  for (const name of MAPFILE_NAMES) {
    const path = `${root}${name}`;

    let isTS = () => false;
    let content = null;
    let error = null;

    try {
      content = await Deno.readTextFile(path);
      isTS = () => name.endsWith(".ts");

      result.push({ name, path, content, error, isTS });
    } catch (e) {
      error = e.message;
      result.push({ name, path, content, error, isTS });
    }
  }

  return result;
};
