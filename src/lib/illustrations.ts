export const ILLUSTRATIONS = [
  "coding-rocket",
  "greetings",
  "monitor",
  "papers",
  "retro-computer",
  "robot-coding",
] as const;

export type Illustration = (typeof ILLUSTRATIONS)[number];
