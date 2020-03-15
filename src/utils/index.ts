export const fromEntries = (iterable: [string, any][]) =>
  [...iterable].reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

export const optionsArray = (options: HTMLOptionsCollection) =>
  // Use Array functions on HTMLOptionsCollection
  Array.prototype.filter.call(
    options,
    (option: HTMLOptionElement) => option.selected
  );

export const sanitizeFilename = (filename: string) =>
  filename
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
