import type { Route } from "./+types/about";
import { SITE_NAME } from "~/site";

export function meta({}: Route.MetaArgs) {
    return [
        { title: `About - ${SITE_NAME}` },
        {
            name: "description",
            content: "What this sandbox is, what it's built on, and why it exists.",
        },
    ];
}

const linkClass = "text-navy underline underline-offset-2 hover:opacity-70";

export default function About() {
    return (
        <main className="px-5 pb-16 pt-8 sm:px-8">
            <h1 className="text-lg text-ink">About</h1>

            <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
                <div className="max-w-xl space-y-4 text-sm text-ink-soft">
                    <p>
                        {SITE_NAME} is my personal sandbox for image-feed and
                        visual-discovery UI. It's a place to try out different
                        ways of browsing the same collection of photos and see
                        how each one actually feels to use, rather than just
                        reason about it.
                    </p>
                    <p>
                        The collection of images is based off images pulled from
                        curated{" "}
                        <a
                            href="https://www.are.na"
                            target="_blank"
                            rel="noreferrer"
                            className={linkClass}
                        >
                            are.na
                        </a>{" "}
                        channels. Every image is embedded with CLIP and indexed
                        in Postgres with pgvector, the same embedding space
                        powers both the Dynamic Graph feed and Magic Search.
                    </p>
                    <p>
                        The feed is the core of of any social media platform.
                        Masonry, Ambient, and Dynamic Graph are the same data
                        shown three different ways, one switch away from each
                        other on purpose so the differences are visible. It's
                        built to keep growing: new browsing or discovery
                        experiments get added to that switch over time.
                    </p>

                    <p>
                        The social-media framing is a starting point, not the
                        endpoint. This project was first inspired by me 
                        learning a lot about Silk. In a podcast, Zane Kindness 
                        talks about how Silk started off as a tool for curators 
                        and only recently focused on becoming a social media 
                        platform. What these modes really are is tools for
                        thinking with a collection. The lineage goes back to
                        Vannevar Bush's 1945 Memex, a hypothetical desk that let
                        a researcher build associative trails between documents
                        and walk them later.
                    </p>
                    <p>
                        Browsing by visual similarity, or searching by meaning
                        instead of tags, is a small version of that idea: less a
                        channel to consume and more an instrument for finding
                        your way around a body of material. The sandbox is where
                        I test which interfaces actually support that.
                    </p>

                    <p>
                        More information on the build can be found at the
                        portfolio write-up:{" "}
                        <a
                            href="https://linpaul.com/portfolio/social-media-sandbox"
                            target="_blank"
                            rel="noreferrer"
                            className={linkClass}
                        >
                            linpaul.com/portfolio/social-media-sandbox
                        </a>
                        .
                    </p>
                </div>

                <img
                    src="/memex-2857432598.png"
                    alt="Illustration of Vannevar Bush's Memex, a desk-sized device for browsing associative trails between documents."
                    className="w-full shrink-0 border-2 border-ink bg-paper sm:w-[28rem] lg:w-[34rem]"
                />
            </div>
        </main>
    );
}
