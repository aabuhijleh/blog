export const ILLUSTRATIONS = [
  "coding-rocket",
  "greetings",
  "papers",
  "retro-computer",
  "robot-coding",
] as const;

export type Illustration = (typeof ILLUSTRATIONS)[number];
