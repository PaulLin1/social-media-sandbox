import { type CSSProperties } from "react";
import { Link } from "react-router";
import { arenaImage } from "~/arena-image";
import { accentFor } from "~/accent";
import { useAccentSnake } from "~/useAccentSnake";
import type { ChannelCard } from "~/channels.server";

// "1,903" reads like a spreadsheet cell; "1.9k" reads like a caption. Used
// for the one number this page (and channels/Channel.tsx) still shows - a
// channel's item count.
export function formatCount(n: number): string {
    if (n < 1000) return String(n);
    return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

export function Channels({ channels }: { channels: ChannelCard[] }) {
    return (
        <main className="px-5 pb-16 pt-6 sm:px-8 sm:pt-8">
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(248px,1fr))]">
                {channels.map((ch) => (
                    <ChannelCardView key={ch.id} channel={ch} />
                ))}
            </div>
        </main>
    );
}

// One cover image, not a four-up mosaic with visible seams between the
// tiles - a curated collection reads as a single cover, not a spec sheet.
// Same accent signature as PostGrid's cards (hashed from curator/title, so
// a curator's channels and posts share their color): an arc that snakes
// around the border on hover/focus (`.accent-card` in app.css, driven by
// useAccentSnake.ts).
function ChannelCardView({ channel }: { channel: ChannelCard }) {
    const cover = channel.preview[0];
    const coverSrc = cover ? (arenaImage(cover.imageUrl, 340) ?? `/i/${cover.id}`) : null;
    const accent = accentFor(channel.curator ?? channel.title);
    const snake = useAccentSnake<HTMLAnchorElement>();

    return (
        <Link
            to={`/channels/${channel.id}`}
            style={{ "--accent": accent.cssVar } as CSSProperties}
            className="accent-card flex flex-col overflow-hidden rounded-[var(--radius)] bg-paper shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-shadow duration-200 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.18)]"
            {...snake}
        >
            <div className="aspect-[4/3] bg-wash">
                {coverSrc && (
                    <img
                        src={coverSrc}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="flex flex-col gap-1 p-4">
                <h2 className="truncate text-sm font-medium text-ink">
                    {channel.title}
                </h2>
                {(channel.curator || channel.itemCount != null) && (
                    <p className="truncate text-xs text-ink-soft">
                        {channel.curator && `@${channel.curator}`}
                        {channel.curator && channel.itemCount != null && " · "}
                        {channel.itemCount != null &&
                            `${formatCount(channel.itemCount)} items`}
                    </p>
                )}
            </div>
        </Link>
    );
}
