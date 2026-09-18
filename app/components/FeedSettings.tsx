import { useCallback, useEffect, useState } from "react";
import { Dropdown } from "~/components/Dropdown";

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

/**
 * The Masonry|Ambient switch on a channel page, rendered inline next to the
 * channel header (see channels/Channel.tsx). Same Dropdown as FeedModeSwitch.
 */
export function FeedSettings({
    view,
    onChange,
}: {
    view: FeedView;
    onChange: (v: FeedView) => void;
}) {
    return (
        <Dropdown value={view} ariaLabel="Feed view" options={OPTIONS} onChange={onChange} />
    );
}
