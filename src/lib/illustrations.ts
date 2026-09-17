export const ILLUSTRATIONS = [
  "greetings",
  "monitor",
  "papers",
  "robot-coding",
] as const;

export type Illustration = (typeof ILLUSTRATIONS)[number];
