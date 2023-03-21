import { DenoModule } from "./types.ts";

export const extractURL = (str: string): URL | null => {
  const match = /from\s*["|']{1}(.+)["|']{1};?/gm.exec(str);

  return (match && new URL(match[1])) || null;
};

const extractNameAndVersion = (str: string): string[] => {
  const match = /\/?(\w+)@v?([\d.]+)\/?/.exec(str);

  return (match && match.toSpliced(0, 1).reverse()) || [];
};

const buildSourceURLWithoutVersion = (
  pathname: string,
  origin: string,
): string => {
  const match = /(.*)@/.exec(pathname);

  return (match && `${origin}${match[1]}`) || "";
};

const buildSourceURLWithVersion = (
  pathname: string,
  origin: string,
): string => {
  const match = /(.*@v?[\d.]+)\/{1}/.exec(pathname);

  return (match && `${origin}${match[1]}`) || "";
};

const fetchLatestSourceURL = (source: string): Promise<string> =>
  fetch(source).then((response) => response.url);

export const buildModule = async (str: string): Promise<DenoModule> => {
  const currentSource = extractURL(str);
  const currentSourceURL = buildSourceURLWithVersion(
    currentSource!.pathname,
    currentSource!.origin,
  );
  const mainSourceURL = buildSourceURLWithoutVersion(
    currentSource!.pathname,
    currentSource!.origin,
  );
  const latestSourceURL = await fetchLatestSourceURL(mainSourceURL);
  const latestSource = new URL(latestSourceURL);

  const [currentVersion, name] = extractNameAndVersion(currentSource!.pathname);
  const [latestVersion] = extractNameAndVersion(latestSource!.pathname);

  const updated = false;

  return {
    name,
    currentSourceURL,
    currentVersion,
    latestSourceURL,
    latestVersion,
    updated,
    shouldUpdate() {
      return currentVersion !== latestVersion;
    },
  };
};
