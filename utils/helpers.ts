export const sanitizeFilename = (name: string) => {
  return name.replace(/[^\x20-\x7E]/g, '').replace(/ /g, '_');
};
