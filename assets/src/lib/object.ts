type TransformKeysTarget = {
  [key: string]: any;
};

export function transformKeys(
  obj: TransformKeysTarget,
  transformer: (s: string) => string
) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  for (const key of Object.keys(obj)) {
    const nextKey = transformer(key);
    const currentTarget = obj[key];

    if (Array.isArray(currentTarget)) {
      obj[nextKey] = currentTarget.map((item) =>
        transformKeys(item, transformer)
      );
    } else {
      obj[nextKey] = transformKeys(currentTarget, transformer);
    }

    if (key !== nextKey) {
      delete obj[key];
    }
  }

  return obj;
}
