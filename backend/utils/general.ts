export const parseFilename = (filename: string) => {
  let type = "";
  let number = 0;
  let i = 0;

  // Extract type (e.g., "input" or "output")
  while (i < filename.length && isNaN(Number(filename[i]))) {
    type += filename[i];
    i++;
  }

  // Extract number
  while (i < filename.length && !isNaN(Number(filename[i]))) {
    number = number * 10 + Number(filename[i]);
    i++;
  }

  return { type, number };
};
