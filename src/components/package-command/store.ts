import { persistentAtom } from "@nanostores/persistent";

export const PACKAGE_MANAGERS = ["bun", "pnpm", "npm", "yarn"] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const DEFAULT_PACKAGE_MANAGER: PackageManager = "bun";

export const PACKAGE_MANAGER_STORAGE_KEY = "package-manager";

const isPackageManager = (value: string): value is PackageManager =>
  PACKAGE_MANAGERS.includes(value as PackageManager);

export const $packageManager = persistentAtom<PackageManager>(
  PACKAGE_MANAGER_STORAGE_KEY,
  DEFAULT_PACKAGE_MANAGER,
  {
    encode: String,
    decode: (value) => (isPackageManager(value) ? value : DEFAULT_PACKAGE_MANAGER),
  },
);

if (typeof document !== "undefined") {
  $packageManager.subscribe((packageManager) => {
    document.documentElement.dataset.packageManager = packageManager;
  });
}
