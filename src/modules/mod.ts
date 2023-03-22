import {
  buildSourceURLWithoutVersion,
  buildSourceURLWithVersion,
  extractNameAndVersion,
  extractURL,
  fetchLatestSourceURL,
} from "./../helpers/mod.ts";
import { DenoModule } from "./types.ts";

const TS_SOURCE_REGEX = /from\s*["|']{1}(.+)["|']{1};?/gm;

export const buildTSModule = (str: string): Promise<DenoModule | null> => {
  const currentSource = extractURL(str, TS_SOURCE_REGEX);

  return buildModule(currentSource);
};

export const buildJSONModule = (str: string): Promise<DenoModule | null> => {
  let currentSource = null;

  try {
    currentSource = new URL(str);
  } catch (_) {
    // do nothing
  }

  return buildModule(currentSource);
};

const buildModule = async (
  currentSource: URL | null,
): Promise<DenoModule | null> => {
  if (currentSource) {
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

    const [currentVersion, name] = extractNameAndVersion(
      currentSource!.pathname,
    );
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
  }

  return null;
};
