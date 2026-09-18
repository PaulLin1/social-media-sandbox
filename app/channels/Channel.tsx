import { Link } from "react-router";
import { PostGrid } from "~/components/PostGrid";
import { FeedSettings, useFeedView } from "~/components/FeedSettings";
import { AmbientCollage } from "~/components/AmbientCollage";
import { formatCount } from "~/channels/Channels";
import type { ChannelDetail } from "~/channels.server";

export function Channel({ channel }: { channel: ChannelDetail }) {
    const [view, changeView] = useFeedView();
    const ambient = view === "ambient" && channel.blocks.length > 0;

    return (
        <main
            className={
                ambient
                    ? "fixed inset-x-0 top-14 bottom-16 flex flex-col px-5 sm:inset-x-auto sm:bottom-0 sm:left-60 sm:right-0 sm:top-0 sm:px-8"
                    : "relative px-5 pb-16 sm:px-8"
            }
        >
            {/* Only the dropdown floats while scrolling - the breadcrumb and
                channel title below are plain in-flow content, same split as
                feeds.masonry.tsx's own dropdown. */}
            <div
                className={`flex justify-end pb-4 pt-6 sm:pt-8 ${ambient ? "shrink-0" : "sticky top-0 z-10"}`}
            >
                <FeedSettings view={view} onChange={changeView} />
            </div>

            <div className={ambient ? "hidden" : ""}>
                <Link
                    to="/channels"
                    className="text-xs text-ink-soft transition-opacity hover:opacity-60"
                >
                    ← Channels
                </Link>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-rule pb-3">
                    <h1 className="text-lg text-ink">{channel.title}</h1>
                    {channel.curator && (
                        <span className="text-sm text-ink-soft">@{channel.curator}</span>
                    )}
                    {channel.itemCount != null && (
                        <span className="text-sm text-ink-soft">
                            {formatCount(channel.itemCount)} items
                        </span>
                    )}
                </div>

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
