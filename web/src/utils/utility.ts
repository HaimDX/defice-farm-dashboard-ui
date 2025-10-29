export function extractBuildIdFromUrl(url: string): string | null {
  const matches = url.match(/dashboard\/builds\/([a-f0-9\-]{36})(?:\/sessions)?/);
  return matches?.[1] || null;
}
