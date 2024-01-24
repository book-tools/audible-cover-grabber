export const convertToStringParams = (
  obj: Record<string, unknown>,
): Record<string, string> => {
  const params: Record<string, string> = Object.fromEntries<string>(
    Object.entries(obj).map(([key, value]) => [
      key,
      value ? value.toString() : '',
    ]),
  );

  return params;
};
