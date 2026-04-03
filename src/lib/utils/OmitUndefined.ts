export function omitUndefined<T extends object>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  );
}
