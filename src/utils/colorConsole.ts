export const colorConsole = {
  red: (message: string) => console.log(`\x1b[31m${message}\x1b[0m`),
  green: (message: string) => console.log(`\x1b[32m${message}\x1b[0m`),
  blue: (message: string) => console.log(`\x1b[34m${message}\x1b[0m`),
  yellow: (message: string) => console.log(`\x1b[33m${message}\x1b[0m`),
};
