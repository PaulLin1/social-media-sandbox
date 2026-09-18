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
        <main className="fixed inset-x-0 top-14 bottom-16 flex flex-col px-5 sm:inset-x-auto sm:bottom-0 sm:left-60 sm:right-0 sm:top-0 sm:px-8">
            <div className="flex shrink-0 justify-end pb-4 pt-6 sm:pt-8">
                <FeedModeSwitch active="ambient" />
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
