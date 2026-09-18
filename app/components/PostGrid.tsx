import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { blockImageSrc } from "~/arena-image";
import { MEDIA_ACCENTS, normalizeBlockType, type BlockType } from "~/accent";
import { useAccentSnake } from "~/useAccentSnake";

// Matches the old `columns-[17rem] gap-x-4` (17rem = 272px, gap-x-4 = 16px).
const GRID_COLUMN_WIDTH = 272;
const GRID_GAP = 16;

export type Block = {
    id: number;
    type?: BlockType | string | null;
    title: string | null;
    posterName: string | null;
    imageUrl?: string | null;
};

export function PostGrid({ blocks }: { blocks: Block[] }) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [columnCount, setColumnCount] = useState(1);

    // Column count from the grid's width; blocks are assigned to columns by
    // `index % columnCount` below so each item's column is fixed forever and
    // appending more blocks never moves items already on screen.
    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const updateColumnCount = () => {
            const width = grid.clientWidth;
            setColumnCount(Math.max(1, Math.floor((width + GRID_GAP) / (GRID_COLUMN_WIDTH + GRID_GAP))));
        };

        updateColumnCount();
        const observer = new ResizeObserver(updateColumnCount);
        observer.observe(grid);
        return () => observer.disconnect();
    }, []);

    const columns = useMemo(() => {
        const cols: Block[][] = Array.from({ length: columnCount }, () => []);
        blocks.forEach((block, i) => cols[i % columnCount].push(block));
        return cols;
    }, [blocks, columnCount]);

    return (
        <div ref={gridRef} className="flex flex-row gap-4">
            {columns.map((column, i) => (
                <div key={i} className="flex flex-1 min-w-0 flex-col gap-4">
                    {column.map((block) => (
                        <PostCard key={block.id} block={block} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function PostCard({ block }: { block: Block }) {
    const name = block.posterName ?? "unknown";
    // `Array.from` splits by code point, not UTF-16 code unit - `name[0]`
    // on a name starting with an emoji or other astral character grabs only
    // half a surrogate pair, which renders as mojibake and (worse) differs
    // between server and client HTML serialization, breaking hydration.
    const initial = Array.from(name)[0]?.toUpperCase() ?? "?";
    const type = normalizeBlockType(block.type ?? null);
    const accent = MEDIA_ACCENTS[type];
    const snake = useAccentSnake<HTMLAnchorElement>();

    return (
        // Every image click lands on its own page (routes/picture.tsx), not
        // the graph - that has its own entry point now (Feeds -> Dynamic
        // Graph, or "Explore" from the picture page itself). Color here tags
        // *what kind of block this is* (photo/link/embed/file/text, see
        // ~/accent.ts): an arc that snakes around the border on hover/focus
        // (`.accent-card` in app.css, driven by useAccentSnake.ts).
        <Link
            to={`/p/${block.id}`}
            style={{ "--accent": accent.cssVar } as CSSProperties}
            className="accent-card block w-full overflow-hidden rounded-[var(--radius)] bg-paper shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-shadow duration-200 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.18)]"
            {...snake}
        >
            <div className="flex items-center gap-2 px-2.5 py-2">
                <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${accent.chip}`}
                >
                    {initial}
                </span>
                <span className="truncate text-sm font-medium text-ink">
                    {name}
                </span>
                {type !== "Image" && (
                    <span
                        className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${accent.tint} text-ink-soft`}
                    >
                        {accent.label}
                    </span>
                )}
            </div>
            {block.imageUrl ? (
                <img
                    src={blockImageSrc(block, 400)}
                    alt={block.title ?? "untitled"}
                    loading="lazy"
                    decoding="async"
                    className="w-full object-contain"
                    onError={(e) => {
                        (e.currentTarget.closest("a") as HTMLElement).style.display = "none";
                    }}
                />
            ) : (
                <div className={`flex min-h-[140px] items-center justify-center p-4 text-center ${accent.tint}`}>
                    <p className="line-clamp-6 text-sm font-medium text-ink">
                        {block.title?.trim() || "Untitled"}
                    </p>
                </div>
            )}
        </Link>
    );
}
