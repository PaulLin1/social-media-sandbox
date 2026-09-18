import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/feeds.masonry";
import { PostGrid, type Block } from "~/components/PostGrid";
import { FeedModeSwitch } from "~/components/FeedModeSwitch";
import { randomBlocks } from "~/blocks.server";
import { getExperiment } from "~/experiments";
import { SITE_NAME } from "~/site";

const experiment = getExperiment("masonry");

export function meta({}: Route.MetaArgs) {
    return [
        { title: `${experiment.name} - ${SITE_NAME}` },
        { name: "description", content: experiment.blurb },
    ];
}

// Moved here verbatim from the old routes/home.tsx - same random-seeded,
// paginated query, now shared via blocks.server.ts.
export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const seed = url.searchParams.get("seed") ?? String(Date.now());
    const blocks = await randomBlocks(100, seed, offset);
    return { blocks, seed };
}

export default function FeedsMasonry({ loaderData }: Route.ComponentProps) {
    const [blocks, setBlocks] = useState<Block[]>(loaderData.blocks);
    const fetcher = useFetcher<{ blocks: Block[] }>();
    const sentinelRef = useRef<HTMLDivElement>(null);

    const offsetRef = useRef(loaderData.blocks.length);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    useEffect(() => {
        if (fetcher.data?.blocks) {
            setBlocks((prev) => [...prev, ...fetcher.data!.blocks]);
            offsetRef.current += fetcher.data.blocks.length;
        }
    }, [fetcher.data]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0]?.isIntersecting;
                const currentFetcher = fetcherRef.current;
                if (isVisible && currentFetcher.state === "idle") {
                    // "index" disambiguates this index route ("/") from its parent
                    // layout route - without it fetcher.load() silently targets the
                    // loader-less parent and no-ops. (Same as the old home.tsx.)
                    currentFetcher.load(
                        `/?index&offset=${offsetRef.current}&seed=${loaderData.seed}`,
                    );
                }
            },
            // Generous on purpose: a fast flick-scroll can cover several
            // thousand px before the network round-trip for the next page
            // (100 rows, a real query, a serverless Postgres pooler) comes
            // back. 1000px used to mean the fetch often didn't start until
            // you were already close to the loaded edge, so a fast scroll
            // could reach the true end of the DOM before new rows arrived,
            // which read as the feed "slowing down." Triggering much
            // earlier gives that round-trip room to finish unnoticed.
            { rootMargin: "4000px" },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loaderData.seed]);

    return (
        <main className="relative px-5 pb-16 sm:px-8">
            <div className="sticky top-0 z-10 flex justify-end pb-4 pt-6 sm:pt-8">
                <FeedModeSwitch active="masonry" />
            </div>

            <PostGrid blocks={blocks} />
            <div ref={sentinelRef} className="h-1 w-full" />
            {fetcher.state !== "idle" && (
                <p className="py-8 text-center text-sm text-ink-soft">Loading more…</p>
            )}
        </main>
    );
}
