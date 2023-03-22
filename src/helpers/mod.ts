export const extractURL = (str: string, regex: RegExp): URL | null => {
  const match = regex.exec(str);

  return (match && new URL(match[1])) || null;
};

export const extractNameAndVersion = (str: string): string[] => {
  const match = /\/?(\w+)@v?([\d.]+)\/?/.exec(str);

  return (match && match.toSpliced(0, 1).reverse()) || [];
};

export const buildSourceURLWithoutVersion = (
  pathname: string,
  origin: string,
): string => {
  const match = /(.*)@/.exec(pathname);

  return (match && `${origin}${match[1]}`) || "";
};

export const buildSourceURLWithVersion = (
  pathname: string,
  origin: string,
): string => {
  const match = /(.*@v?[\d.]+)\/{1}/.exec(pathname);

  return (match && `${origin}${match[1]}`) || "";
};

const simpleCache = new Map();

export const fetchLatestSourceURL = async (source: string): Promise<string> => {
  if (!simpleCache.has(source)) {
    const url = await fetch(source).then((response) => response.url);

    simpleCache.set(source, url);
  }

  return simpleCache.get(source);
};
