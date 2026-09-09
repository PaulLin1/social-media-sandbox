import { eq, sql } from "drizzle-orm";
import { db } from "~/db.server";
import { blocks } from "~/db/schema";
import { posterNameSql } from "~/db/poster";

export type RandomBlock = {
    id: number;
    title: string | null;
    imageUrl: string | null;
    posterName: string | null;
};

export type BlockDetail = {
    id: number;
    arenaBlockId: number;
    title: string | null;
    imageUrl: string | null;
    sourceUrl: string | null;
    posterName: string | null;
};

/**
 * `limit` images (offset by `offset`) in a stable random order for `seed` -  * repeated calls with the same seed don't reshuffle underneath you, which is
 * what makes paginated infinite scroll not skip/dupe rows. Shared by the
 * masonry feed (paginated), the ambient pool, and the dynamic-graph feed's
 * random starting image (each `limit(1)`, no offset).
 */
export async function randomBlocks(
    limit: number,
    seed: string,
    offset = 0,
): Promise<RandomBlock[]> {
    return db
        .select({
            id: blocks.id,
            title: blocks.title,
            imageUrl: blocks.imageUrl,
            posterName: posterNameSql,
        })
        .from(blocks)
        .where(sql`${blocks.type} = 'Image' AND ${blocks.imageUrl} IS NOT NULL`)
        .orderBy(sql`md5(${blocks.id}::text || ${seed})`)
        .limit(limit)
        .offset(offset);
}

/** One block's detail - the picture page (routes/picture.tsx). Null if the id doesn't exist. */
export async function getBlock(id: number): Promise<BlockDetail | null> {
    const rows = await db
        .select({
            id: blocks.id,
            arenaBlockId: blocks.arenaBlockId,
            title: blocks.title,
            imageUrl: blocks.imageUrl,
            sourceUrl: blocks.sourceUrl,
            posterName: posterNameSql,
        })
        .from(blocks)
        .where(eq(blocks.id, id))
        .limit(1);
    return rows[0] ?? null;
}
