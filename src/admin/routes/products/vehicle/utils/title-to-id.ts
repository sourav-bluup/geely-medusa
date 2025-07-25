export const titleToId = (title: string) => {
  return title
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};
