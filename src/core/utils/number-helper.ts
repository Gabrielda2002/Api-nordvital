/**
 * Parses an optional numeric field coming from a request.
 *
 * Keeps the current value when nothing usable was provided (`undefined`, `null`
 * or an empty string) and preserves a legitimate `0`, which `Number(value) || current`
 * would silently discard.
 *
 * @param incoming Raw value received from the request.
 * @param current Value currently stored on the entity.
 * @returns The parsed number, or `current` when nothing usable was provided.
 */
export function optionalNumber(incoming: unknown, current: number): number {
  return incoming === undefined || incoming === null || incoming === ""
    ? current
    : Number(incoming);
}
