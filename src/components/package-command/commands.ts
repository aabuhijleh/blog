import { PACKAGE_MANAGERS, type PackageManager } from "./store";

export type PackageCommands = Record<PackageManager, string>;

const EXECUTE: PackageCommands = {
  bun: "bunx --bun",
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
};

const CREATE: PackageCommands = {
  bun: "bun create",
  pnpm: "pnpm create",
  npm: "npm create",
  yarn: "yarn create",
};

const ADD: PackageCommands = {
  bun: "bun add",
  pnpm: "pnpm add",
  npm: "npm install",
  yarn: "yarn add",
};

const REMOVE: PackageCommands = {
  bun: "bun remove",
  pnpm: "pnpm remove",
  npm: "npm uninstall",
  yarn: "yarn remove",
};

const RUN: PackageCommands = {
  bun: "bun run",
  pnpm: "pnpm",
  npm: "npm run",
  yarn: "yarn",
};

const INSTALL: PackageCommands = {
  bun: "bun install",
  pnpm: "pnpm install",
  npm: "npm install",
  yarn: "yarn",
};

const DEV_FLAG: PackageCommands = {
  bun: "-d",
  pnpm: "-D",
  npm: "-D",
  yarn: "-D",
};

const DEV_FLAGS = new Set(["-D", "--dev", "--save-dev"]);

const build = (prefixes: PackageCommands, parts: Array<string | undefined>) =>
  Object.fromEntries(
    PACKAGE_MANAGERS.map((manager) => [
      manager,
      [prefixes[manager], ...parts].filter(Boolean).join(" "),
    ]),
  ) as PackageCommands;

const same = (command: string) =>
  Object.fromEntries(PACKAGE_MANAGERS.map((manager) => [manager, command])) as PackageCommands;

const withDevFlag = (prefixes: PackageCommands, args: Array<string>) => {
  const isDev = args.some((arg) => DEV_FLAGS.has(arg));
  const rest = args.filter((arg) => !DEV_FLAGS.has(arg)).join(" ");
  return Object.fromEntries(
    PACKAGE_MANAGERS.map((manager) => [
      manager,
      [prefixes[manager], isDev ? DEV_FLAG[manager] : undefined, rest].filter(Boolean).join(" "),
    ]),
  ) as PackageCommands;
};

/** Translates an npm-flavoured command into its bun, pnpm and yarn equivalents. */
export const toPackageCommands = (command: string): PackageCommands => {
  const [tool, verb, ...args] = command.trim().split(/\s+/);

  if (tool === "npx") {
    return build(EXECUTE, verb ? [verb, ...args] : []);
  }

  if (tool !== "npm" || !verb) {
    return same(command.trim());
  }

  if (verb === "create" || verb === "init") {
    return build(CREATE, args);
  }

  if (verb === "run") {
    return build(RUN, args);
  }

  if (verb === "uninstall" || verb === "remove" || verb === "rm") {
    return build(REMOVE, args);
  }

  if (verb === "install" || verb === "i" || verb === "add") {
    return args.length === 0 ? { ...INSTALL } : withDevFlag(ADD, args);
  }

  return same(command.trim());
};
