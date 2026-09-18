import type { Route } from "./+types/search";
import { Search } from "../search/search";
import { search } from "~/search.server";
import { randomBlocks } from "~/blocks.server";
import { SITE_NAME } from "~/site";

export function meta({}: Route.MetaArgs) {
    return [
        { title: `Search - ${SITE_NAME}` },
        {
            name: "description",
            content:
                "Describe what you're looking for in words. CLIP matches your query against every image in the collection by meaning, not tags.",
        },
    ];
}

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim() ?? "";

    if (!query) {
        // No query yet - seed the graph on one random image (same random-order
        // query the masonry feed uses) so there's something to look at before
        // the first search moves it.
        const [row] = await randomBlocks(1, String(Date.now()));
        return { query, rootId: row?.id ?? null };
    }

    const rows = await search(query);
    return { query, rootId: rows[0]?.id ?? null };
}

export default function SearchRoute({ loaderData }: Route.ComponentProps) {
    return <Search query={loaderData.query} rootId={loaderData.rootId} />;
}
