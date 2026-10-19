const LIKE_ESCAPE_CHAR = "!";

/**
 * Normalizes text used for names and search terms.
 *
 * Converts to NFC so precomposed and decomposed accents compare consistently,
 * trims the edges and collapses every whitespace run into a single space.
 */
export function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Builds a `LIKE` pattern that tolerates extra whitespace between words and
 * escapes any wildcard the user typed.
 *
 * Each token is joined with `%`, so "INSTITUTO  DE INVESTIGACIÓN" becomes
 * "%INSTITUTO%DE%INVESTIGACIÓN%". Always use it with `ESCAPE '!'`.
 */
export function buildContainsPattern(value: unknown): string {
  const text = normalizeText(value);

  if (!text) {
    return "%";
  }

  return `%${text.split(" ").map(escapeLikeToken).join("%")}%`;
}

function escapeLikeToken(token: string): string {
  return token.replace(/[!%_]/g, (char) => `${LIKE_ESCAPE_CHAR}${char}`);
}
