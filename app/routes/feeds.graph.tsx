import { useState } from "react";
import type { Route } from "./+types/feeds.graph";
import { ExploreWeb } from "~/explore/ExploreWeb";
import { FeedModeSwitch } from "~/components/FeedModeSwitch";
import { randomBlocks } from "~/blocks.server";
import { getExperiment } from "~/experiments";
import { SITE_NAME } from "~/site";

const experiment = getExperiment("graph");

export function meta({}: Route.MetaArgs) {
    return [
        { title: `${experiment.name} - ${SITE_NAME}` },
        { name: "description", content: experiment.blurb },
    ];
}

// The graph's standalone entry point. `?start=<id>` seeds on one specific
// image - that's how the picture page's "Explore" link gets here (routes/
// picture.tsx). With no `start`, seeds on one random image instead, via the
// same random-order query the masonry feed and ambient pool use (limit 1, no
// offset).
export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const start = Number(url.searchParams.get("start"));
    if (Number.isInteger(start) && start > 0) {
        return { startId: start };
    }
    const seed = url.searchParams.get("seed") ?? String(Date.now());
    const [row] = await randomBlocks(1, seed);
    return { startId: row?.id ?? null };
}

export default function FeedsGraph({ loaderData }: Route.ComponentProps) {
    // ExploreWeb re-roots itself on whatever node you click, via onPick - this
    // page just needs to seed the very first root and hand it the setter.
    // Roaming from there is ExploreWeb's own behavior, unchanged.
    const [rootId, setRootId] = useState(loaderData.startId);

    return (
        <main className="relative h-[calc(100dvh-3.5rem)] overflow-hidden">
            <FeedModeSwitch active="graph" />

            <div className="pointer-events-none absolute left-5 top-16 z-[110] max-w-[15rem] sm:left-8 sm:top-5 sm:max-w-sm">
                <h1 className="text-lg text-ink">{experiment.name}</h1>
                <p className="mt-1 text-sm text-ink-soft">{experiment.blurb}</p>
            </div>

            <a
                href={`/feeds/graph?seed=${Date.now()}`}
                className="fixed bottom-4 left-1/2 z-[120] -translate-x-1/2 px-2 py-1.5 text-sm text-ink transition-colors hover:underline"
            >
                Shuffle
            </a>

            {rootId != null ? (
                <ExploreWeb rootId={rootId} onPick={setRootId} />
            ) : (
                <div className="absolute inset-0 grid place-items-center text-sm text-ink-soft">
                    no images with embeddings yet.
                </div>
            )}
        </main>
    );
}
