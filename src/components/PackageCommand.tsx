import { useStore } from "@nanostores/react";
import { Check, Copy, SquareTerminal } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "~/lib/cn";
import {
  type PackageCommands,
  toPackageCommands,
} from "~/lib/package-commands";
import {
  $packageManager,
  DEFAULT_PACKAGE_MANAGER,
  PACKAGE_MANAGERS,
  type PackageManager,
} from "~/lib/package-manager";

interface PackageCommandProps {
  command: string;
  commands?: Partial<PackageCommands>;
}

const serverSnapshot = () => DEFAULT_PACKAGE_MANAGER;

const cardClass = cn(
  "not-prose my-8 overflow-hidden rounded-lg border border-terminal-edge bg-terminal font-sans",
);

const headerClass = cn(
  "flex items-center gap-1.5 border-terminal-edge border-b px-2 py-2 sm:gap-2 sm:px-3",
);

const tablistClass = cn(
  "scrollbar-none flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden",
);

const tabClass = cn(
  "shrink-0 cursor-pointer rounded-md border border-transparent px-2 py-1 font-mono text-terminal-muted text-xs leading-6 transition-colors hover:text-terminal-bright sm:px-2.5 sm:text-sm",
);

const copyClass = cn(
  "shrink-0 cursor-pointer rounded-md p-1.5 text-terminal-muted transition-colors hover:bg-terminal-raised hover:text-terminal-bright",
);

const commandClass = cn(
  "overflow-x-auto px-3 py-3 font-mono text-sm text-terminal-ink leading-7 sm:px-4 sm:py-3.5 sm:text-base",
);

export function PackageCommand({ command, commands }: PackageCommandProps) {
  const selected = useStore($packageManager, { ssr: serverSnapshot });
  const id = useId();
  const tablist = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const resetCopied = useRef<ReturnType<typeof setTimeout>>(undefined);

  const resolved = useMemo(
    () => ({ ...toPackageCommands(command), ...commands }),
    [command, commands],
  );

  useEffect(() => () => clearTimeout(resetCopied.current), []);

  const select = (manager: PackageManager) => {
    $packageManager.set(manager);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(resolved[selected]);
    setCopied(true);
    clearTimeout(resetCopied.current);
    resetCopied.current = setTimeout(() => setCopied(false), 2000);
  };

  const moveFocus = (offset: number) => {
    const index = PACKAGE_MANAGERS.indexOf(selected);
    const next =
      PACKAGE_MANAGERS[
        (index + offset + PACKAGE_MANAGERS.length) % PACKAGE_MANAGERS.length
      ];
    if (!next) return;
    select(next);
    tablist.current
      ?.querySelector<HTMLButtonElement>(`[data-package-manager-tab="${next}"]`)
      ?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(-1);
    }
  };

  return (
    <div className={cardClass}>
      <div className={headerClass}>
        <SquareTerminal
          className="hidden size-5 shrink-0 text-terminal-accent sm:block"
          aria-hidden="true"
        />
        <div
          ref={tablist}
          role="tablist"
          aria-label="Package manager"
          className={tablistClass}
          onKeyDown={onKeyDown}
        >
          {PACKAGE_MANAGERS.map((manager) => (
            <button
              key={manager}
              type="button"
              role="tab"
              id={`${id}-tab-${manager}`}
              aria-controls={`${id}-panel-${manager}`}
              aria-selected={manager === selected}
              tabIndex={manager === selected ? 0 : -1}
              data-package-manager-tab={manager}
              className={tabClass}
              onClick={() => select(manager)}
            >
              {manager}
            </button>
          ))}
        </div>
        <button type="button" className={copyClass} onClick={copy}>
          {copied ? (
            <Check className="size-4.5 text-terminal-accent" />
          ) : (
            <Copy className="size-4.5" />
          )}
          <span className="sr-only">
            {copied ? "Command copied" : "Copy command"}
          </span>
        </button>
      </div>
      {PACKAGE_MANAGERS.map((manager) => (
        <pre
          key={manager}
          role="tabpanel"
          id={`${id}-panel-${manager}`}
          aria-labelledby={`${id}-tab-${manager}`}
          data-package-manager-panel={manager}
          className={commandClass}
        >
          <code>{resolved[manager]}</code>
        </pre>
      ))}
    </div>
  );
}
