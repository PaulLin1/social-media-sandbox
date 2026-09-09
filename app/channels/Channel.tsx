import { Link } from "react-router";
import { PostGrid } from "~/components/PostGrid";
import { FeedSettings, useFeedView } from "~/components/FeedSettings";
import { AmbientCollage } from "~/components/AmbientCollage";
import type { ChannelDetail } from "~/channels.server";

export function Channel({ channel }: { channel: ChannelDetail }) {
    const [view, changeView] = useFeedView();
    const ambient = view === "ambient" && channel.blocks.length > 0;

    const header = (
        <div
            className={`bg-paper pb-3 pt-14 sm:pt-5 ${
                ambient ? "shrink-0" : "sticky top-14 z-10"
            }`}
        >
            <Link
                to="/channels"
                className="text-xs text-ink-soft transition-opacity hover:opacity-60"
            >
                ← Channels
            </Link>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="text-lg text-ink">{channel.title}</h1>
                {channel.curator && (
                    <span className="text-sm text-ink-soft">@{channel.curator}</span>
                )}
                {channel.itemCount != null && (
                    <span className="text-sm text-ink-soft">
                        {channel.itemCount.toLocaleString()} items
                    </span>
                )}
            </div>
            {channel.description && (
                <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">
                    {channel.description}
                </p>
            )}
        </div>
    );

    return (
        <main
            className={
                ambient
                    ? "fixed inset-x-0 bottom-0 top-14 flex flex-col px-5 sm:px-8"
                    : "relative px-5 pb-16 sm:px-8"
            }
        >
            <FeedSettings view={view} onChange={changeView} />

            {header}

            <div className={ambient ? "hidden" : ""}>
                {channel.blocks.length === 0 ? (
                    <p className="py-10 text-center text-ink-soft">
                        No images in this channel.
                    </p>
                ) : (
                    <PostGrid blocks={channel.blocks} />
                )}
            </div>

            {ambient && (
                <div className="relative -mx-5 flex-1 sm:-mx-8">
                    <AmbientCollage
                        blocks={channel.blocks}
                        onExit={() => changeView("masonry")}
                    />
                </div>
            )}
        </main>
    );
}
