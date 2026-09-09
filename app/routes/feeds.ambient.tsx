import { useNavigate } from "react-router";
import type { Route } from "./+types/feeds.ambient";
import { AmbientCollage } from "~/components/AmbientCollage";
import { FeedModeSwitch } from "~/components/FeedModeSwitch";
import { getExperiment } from "~/experiments";
import { SITE_NAME } from "~/site";

const experiment = getExperiment("ambient");

export function meta({}: Route.MetaArgs) {
    return [
        { title: `${experiment.name} - ${SITE_NAME}` },
        { name: "description", content: experiment.blurb },
    ];
}

export default function FeedsAmbient() {
    const navigate = useNavigate();

    return (
        <main className="fixed inset-x-0 bottom-0 top-14 flex flex-col px-5 sm:px-8">
            <FeedModeSwitch active="ambient" />

            <div className="max-w-md shrink-0 pb-3 pt-14 sm:pt-5">
                <h1 className="text-lg text-ink">{experiment.name}</h1>
                <p className="mt-1 text-sm text-ink-soft">{experiment.blurb}</p>
            </div>

            <div className="relative -mx-5 flex-1 sm:-mx-8">
                {/* No blocks prop: AmbientCollage draws a random pool itself
                    from /ambient. Esc goes back to the hub, same idea as the
                    old "exit ambient" behavior on the channel/feed toggle. */}
                <AmbientCollage onExit={() => navigate("/")} />
            </div>
        </main>
    );
}
