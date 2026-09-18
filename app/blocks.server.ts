import { eq, sql } from "drizzle-orm";
import { db } from "~/db.server";
import { blocks } from "~/db/schema";
import { posterNameSql } from "~/db/poster";
import { normalizeBlockType, type BlockType } from "~/accent";

export type RandomBlock = {
    id: number;
    type: BlockType;
    title: string | null;
    imageUrl: string | null;
    posterName: string | null;
};

export type BlockDetail = {
    id: number;
    arenaBlockId: number;
    type: BlockType;
    title: string | null;
    imageUrl: string | null;
    sourceUrl: string | null;
    posterName: string | null;
};

// Keep in sync with schema.ts's blocks_feed_idx: everything but the
// incomplete-crawl 'PendingBlock' placeholder, only blocks that can actually
// render something (a thumbnail, or - Text's case - just its own title
// text), and not the handful of Link blocks with garbage multi-KB titles.
const REAL_BLOCK = sql`${blocks.type} != 'PendingBlock' AND (${blocks.imageUrl} IS NOT NULL OR ${blocks.type} = 'Text') AND octet_length(${blocks.title}) <= 2000`;

/**
 * `limit` blocks (offset by `offset`) in a stable random order for `seed` -  * repeated calls with the same seed don't reshuffle underneath you, which is
 * what makes paginated infinite scroll not skip/dupe rows. Shared by the
 * masonry feed (paginated), the ambient pool, and the dynamic-graph feed's
 * random starting image (each `limit(1)`, no offset) - the latter two only
 * ever show Image blocks in practice (AmbientCollage filters out anything
 * without an imageUrl client-side, and the graph's CLIP embeddings only
 * exist for images), so mixing in the other types here is harmless for them.
 */
export async function randomBlocks(
    limit: number,
    seed: string,
    offset = 0,
): Promise<RandomBlock[]> {
    const rows = await db
        .select({
            id: blocks.id,
            type: blocks.type,
            title: blocks.title,
            imageUrl: blocks.imageUrl,
            posterName: posterNameSql,
        })
        .from(blocks)
        .where(REAL_BLOCK)
        .orderBy(sql`md5(${blocks.id}::text || ${seed})`)
        .limit(limit)
        .offset(offset);
    return rows.map((r) => ({ ...r, type: normalizeBlockType(r.type) }));
}

/** One block's detail - the picture page (routes/picture.tsx). Null if the id doesn't exist. */
export async function getBlock(id: number): Promise<BlockDetail | null> {
    const rows = await db
        .select({
            id: blocks.id,
            arenaBlockId: blocks.arenaBlockId,
            type: blocks.type,
            title: blocks.title,
            imageUrl: blocks.imageUrl,
            sourceUrl: blocks.sourceUrl,
            posterName: posterNameSql,
        })
        .from(blocks)
        .where(eq(blocks.id, id))
        .limit(1);
    const row = rows[0];
    return row ? { ...row, type: normalizeBlockType(row.type) } : null;
}
