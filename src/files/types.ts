export type FileName = "import_map.json" | "deps.ts" | "dev_deps.ts";

export type ReadMapFileResult = {
  name: FileName;
  path: string;
  content: string | null;
  error: string | null;
  isTS(): boolean;
};
