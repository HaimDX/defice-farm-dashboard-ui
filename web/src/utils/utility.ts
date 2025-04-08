export function extractBuildIdFromUrl(url: string): string | null {
  const matches = url.match(new RegExp(/dashboard\/builds\/([a-f0-9\-]{36})\/sessions/));
  return matches?.length ? matches[1] : null;
}