export type DenoModule = {
  name: string;
  currentSourceURL: string;
  currentVersion: string;
  latestSourceURL: string;
  latestVersion: string;
  updated: boolean;
  shouldUpdate(): boolean;
};
