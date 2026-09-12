import { useCallback, useEffect, useState } from "react";

export type FeedView = "masonry" | "ambient";

const OPTIONS: { value: FeedView; label: string }[] = [
    { value: "masonry", label: "Masonry" },
    { value: "ambient", label: "Ambient" },
];

const STORAGE_KEY = "feed-view";

/**
 * Feed view preference, persisted in localStorage and shared across the feed
 * and channel pages. Server renders "masonry"; the saved choice is restored
 * after mount so hydration matches (a brief grid-before-collage flash is fine).
 */
export function useFeedView(): [FeedView, (v: FeedView) => void] {
    const [view, setView] = useState<FeedView>("masonry");

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === "ambient" || saved === "masonry") setView(saved);
        } catch {
            /* private mode */
        }
    }, []);

    const change = useCallback((v: FeedView) => {
        setView(v);
        try {
            localStorage.setItem(STORAGE_KEY, v);
        } catch {
            /* private mode */
        }
    }, []);

    return [view, change];
}

// Same plain-text recipe as the masthead nav and FeedModeSwitch - no fill,
// no border.
const PILL =
    "px-2 py-[0.2rem] text-[length:var(--step--1)] transition-colors";

/**
 * The floating Masonry|Ambient switch, top-right under the masthead. "Masonry"
 * is the scrolling image grid; "Ambient" replaces it with the crossfading
 * collage (components/AmbientCollage.tsx).
 */
export function FeedSettings({
    view,
    onChange,
}: {
    view: FeedView;
    onChange: (v: FeedView) => void;
}) {
    return (
        <div className="fixed right-4 top-[4.25rem] z-[120] flex items-center gap-[0.35rem] sm:right-8">
            {OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    aria-pressed={view === opt.value}
                    className={`${PILL} ${
                        view === opt.value
                            ? "text-link underline"
                            : "text-ink hover:underline"
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
