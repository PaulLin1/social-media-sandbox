import { Link } from "react-router";
import { EXPERIMENTS, type ExperimentSlug } from "~/experiments";

// Same exact pill recipe as the masthead nav (components/Masthead.tsx CHIP,
// itself matching linpaul.com's .site-nav a) - a row of separate pills, not
// one cramped segmented box, and the same --step--1 size as everything else
// in the chrome.
const PILL =
    "rounded-full border border-ink px-3 py-[0.2rem] text-[length:var(--step--1)] transition-colors";

/**
 * Real navigation between the three feed experiments - unlike FeedSettings
 * (the channel pages' masonry/ambient toggle, which is local component
 * state), this switches the URL, so each mode is its own bookmarkable page.
 */
export function FeedModeSwitch({ active }: { active: ExperimentSlug }) {
    return (
        <div className="fixed right-4 top-[4.25rem] z-[120] flex items-center gap-[0.35rem] sm:right-8">
            {EXPERIMENTS.map((exp) => (
                <Link
                    key={exp.slug}
                    to={exp.path}
                    aria-current={exp.slug === active ? "page" : undefined}
                    className={`${PILL} ${
                        exp.slug === active
                            ? "bg-ink text-paper"
                            : "bg-paper text-ink hover:bg-[var(--tile-hover)]"
                    }`}
                >
                    {exp.name}
                </Link>
            ))}
        </div>
    );
}
