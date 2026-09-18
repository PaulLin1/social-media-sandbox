import { useEffect, useState } from "react";
import { Form } from "react-router";
import { ExploreWeb } from "~/explore/ExploreWeb";

// The dynamic graph used to be its own separate feed (routes/feeds.graph.tsx)
// with its own "Explore" entry point from a picture page. It lives here now
// instead: search re-roots it on the top match rather than browsing it apart
// from search, so typing a query is what "moves" the graph rather than
// clicking into an image first.
export function Search({ query, rootId }: { query: string; rootId: number | null }) {
    const [currentRoot, setCurrentRoot] = useState(rootId);

    // A fresh search (new `rootId` from the loader) always re-roots the graph,
    // overriding wherever clicking around inside it (onPick, below) had taken
    // you - that hand-off is the whole point of putting search and the graph
    // in one place.
    useEffect(() => {
        setCurrentRoot(rootId);
    }, [rootId]);

    const noResults = query !== "" && rootId === null;

    return (
        <main className="relative h-[calc(100dvh-7.5rem)] overflow-hidden sm:h-dvh">
            {currentRoot != null ? (
                <ExploreWeb rootId={currentRoot} onPick={setCurrentRoot} />
            ) : (
                <div className="absolute inset-0 grid place-items-center px-4 text-center text-sm text-ink-soft">
                    {noResults ? `No results for "${query}"` : "no images with embeddings yet."}
                </div>
            )}

            <div className="fixed inset-x-0 bottom-20 z-[120] flex justify-center px-4 sm:inset-x-auto sm:bottom-6 sm:left-60 sm:right-0">
                <Form
                    method="get"
                    className="flex w-[min(40rem,100%)] items-center gap-2 rounded-full border border-rule bg-paper p-1.5 pl-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] focus-within:border-navy"
                >
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Search…"
                        className="flex-1 bg-transparent text-[0.95rem] text-ink placeholder:text-ink-soft focus:outline-none"
                    />

                    <button
                        type="submit"
                        aria-label="Search"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-paper transition-opacity hover:opacity-90"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>
                </Form>
            </div>
        </main>
    );
}
