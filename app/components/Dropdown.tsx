import { useEffect, useRef, useState } from "react";

export type DropdownOption<T extends string> = { value: T; label: string };

/**
 * A styleable stand-in for `<select>` (used by FeedModeSwitch and
 * FeedSettings) - a native select's closed trigger can be styled freely, but
 * its open menu is drawn by the OS/browser and ignores CSS entirely, which
 * read as "unstyled" the moment you actually opened it. This renders both
 * the trigger and the menu itself, so the popup matches the rest of the app
 * (rounded panel, same option-row language as the sidebar nav's active
 * state) instead of falling back to native chrome.
 */
export function Dropdown<T extends string>({
    value,
    options,
    onChange,
    ariaLabel,
}: {
    value: T;
    options: DropdownOption<T>[];
    onChange: (value: T) => void;
    ariaLabel: string;
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const current = options.find((o) => o.value === value);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <div ref={rootRef} className="relative shrink-0">
            <button
                type="button"
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full border border-rule bg-paper px-3 py-1.5 text-[length:var(--step--1)] text-ink-soft transition-colors hover:text-ink focus:outline-none focus:border-navy"
            >
                {current?.label}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label={ariaLabel}
                    className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-full overflow-hidden rounded-xl border border-rule bg-paper py-1 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                >
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={opt.value === value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`block w-full whitespace-nowrap px-3.5 py-2 text-left text-[0.95rem] transition-colors ${
                                opt.value === value
                                    ? "bg-wash font-medium text-ink"
                                    : "text-ink-soft hover:bg-wash hover:text-ink"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
