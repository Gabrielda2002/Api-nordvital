/**
 * Normalizes a boolean flag coming from a request.
 *
 * The frontend and the query params do not always send a real boolean: it is
 * common to receive `"true"` or `"1"`. Comparing with `=== "true"` silently
 * stores `false` when a real JSON boolean arrives (`true === "true"` is false,
 * and so is `true == "true"`), which turned several flags into always-false
 * columns. This helper accepts every form and defaults to `false`.
 *
 * @param value Raw value received from the request.
 * @returns `true` for `true`, `1`, `"true"` and `"1"`; `false` for anything else.
 */
export function parseBooleanFlag(value: unknown): boolean {
  return value === true || value === 1 || value === "true" || value === "1";
}
