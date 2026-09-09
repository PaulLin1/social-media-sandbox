import type { Route } from "./+types/ambient";
import { randomBlocks } from "~/blocks.server";

// Resource route: no component. components/AmbientCollage.tsx fetches this once
// when the ambient preview mode opens, and pools over the returned images.
export async function loader({ request }: Route.LoaderArgs) {
    const seed = new URL(request.url).searchParams.get("seed") ?? String(Date.now());
    const blocks = await randomBlocks(48, seed);
    return { blocks };
}
