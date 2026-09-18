// Two separate accent systems, both drawing on tokens.css's bright palette:
//
// - "Identity" accents (accentFor) are hashed from a name/title, so the same
//   curator always lands on the same color - used where color stands in for
//   *whose* something is (channel covers, curator initials).
//
// - "Media" accents (MEDIA_ACCENTS) are keyed by an are.na block's actual
//   type, so color stands in for *what kind of thing* a post is - a photo
//   reads differently from a link or a text note at a glance, not just by
//   name coincidence.
//
// Both use solid, saturated fills (not pale tints) - color here is meant to
// be seen, not just hinted at. Each entry also carries `cssVar`, the raw
// token behind the Tailwind classes - components feed it into the `--accent`
// custom property (see the `.accent-card` hover animation in app.css), since
// that CSS can't read a `bg-navy` utility class back out as a color value.

const IDENTITY_ACCENTS = [
    { chip: "bg-navy text-white", cssVar: "var(--color-navy)" },
    { chip: "bg-purple text-white", cssVar: "var(--color-purple)" },
    { chip: "bg-amber text-white", cssVar: "var(--color-amber)" },
    { chip: "bg-teal text-white", cssVar: "var(--color-teal)" },
] as const;

export function accentFor(key: string): (typeof IDENTITY_ACCENTS)[number] {
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
    return IDENTITY_ACCENTS[Math.abs(hash) % IDENTITY_ACCENTS.length];
}

// are.na's own block.class values, minus "PendingBlock" (an incomplete crawl
// placeholder with no title/image worth showing - filtered out at the query
// level, see blocks.server.ts).
export type BlockType = "Image" | "Link" | "Embed" | "Attachment" | "Text";

export function normalizeBlockType(type: string | null): BlockType {
    return type === "Link" || type === "Embed" || type === "Attachment" || type === "Text"
        ? type
        : "Image";
}

export const MEDIA_ACCENTS: Record<
    BlockType,
    { label: string; chip: string; tint: string; cssVar: string }
> = {
    Image: { label: "Photo", chip: "bg-navy text-white", tint: "bg-navy/10", cssVar: "var(--color-navy)" },
    Link: { label: "Link", chip: "bg-teal text-white", tint: "bg-teal/10", cssVar: "var(--color-teal)" },
    Embed: { label: "Embed", chip: "bg-purple text-white", tint: "bg-purple/10", cssVar: "var(--color-purple)" },
    Attachment: { label: "File", chip: "bg-amber text-white", tint: "bg-amber/10", cssVar: "var(--color-amber)" },
    Text: { label: "Text", chip: "bg-rose text-white", tint: "bg-rose/10", cssVar: "var(--color-rose)" },
};
