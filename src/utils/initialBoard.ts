export const initializeBoard = (size: number): 'empty'[][] => {
  return Array.from({ length: size }, () => Array(size).fill('empty'));
};
