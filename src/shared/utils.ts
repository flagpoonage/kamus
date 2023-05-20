export function isObject(
  value: unknown
): value is Record<PropertyKey, unknown> {
  return Boolean(value && !Array.isArray(value) && typeof value === 'object');
}
