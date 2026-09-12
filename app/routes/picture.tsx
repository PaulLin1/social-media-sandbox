import { Link } from "react-router";
import type { Route } from "./+types/picture";
import { getBlock } from "~/blocks.server";
import { blockImageSrc } from "~/arena-image";
import { SITE_NAME } from "~/site";

// Where every image click lands (see PostGrid.tsx) - one block's own page,
// not the graph. From here, "Explore" jumps into the dynamic-graph feed
// rooted on this specific image (routes/feeds.graph.tsx's ?start= param).
export async function loader({ params }: Route.LoaderArgs) {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
        throw new Response("Not found", { status: 404 });
    }
    const block = await getBlock(id);
    if (!block) throw new Response("Not found", { status: 404 });
    return { block };
}

export function meta({}: Route.MetaArgs) {
    return [
        { title: `Image - ${SITE_NAME}` },
        { name: "description", content: `One image from the ${SITE_NAME} collection.` },
    ];
}

export default function Picture({ loaderData }: Route.ComponentProps) {
    const { block } = loaderData;

    return (
        <main className="px-5 pb-16 pt-16 sm:px-8 sm:pt-8">
            {/* Same floating-text language as FeedModeSwitch, one option: the
                one thing not already reachable from the global nav. */}
            <div className="fixed right-4 top-[4.25rem] z-[120] sm:right-8">
                <Link
                    to={`/feeds/graph?start=${block.id}`}
                    className="px-2 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ink-soft transition-colors hover:text-ink hover:underline"
                >
                    Explore
                </Link>
            </div>

            <img
                src={blockImageSrc(block, 900)}
                alt={block.title ?? ""}
                className="mx-auto max-h-[70vh] w-auto max-w-full object-contain"
                onError={(e) => {
                    const el = e.currentTarget;
                    const fallback = `/i/${block.id}`;
                    if (!el.src.endsWith(fallback)) el.src = fallback;
                }}
            />

            <div className="mx-auto mt-4 max-w-2xl text-sm text-ink-soft">
                <p className="text-ink">{block.title?.trim() || "Untitled"}</p>
                <p className="mt-1">
                    {block.posterName ? `Posted by ${block.posterName}` : "Poster unknown"}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {block.sourceUrl && (
                        <a
                            href={block.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-navy underline underline-offset-2 hover:opacity-70"
                        >
                            Original source
                        </a>
                    )}
                    <a
                        href={`https://www.are.na/block/${block.arenaBlockId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-navy underline underline-offset-2 hover:opacity-70"
                    >
                        View on are.na
                    </a>
                </div>
            </div>
        </main>
    );
}
