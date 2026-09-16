import { NavLink } from "react-router";
import { SITE_NAME } from "~/site";

// "Feeds" points at "/" - the feed hub is home, no separate landing page.
const navItems = [
    { name: "Feeds", to: "/" },
    { name: "Search", to: "/search" },
    { name: "Channels", to: "/channels" },
    { name: "About", to: "/about" },
];

// Plain text - same recipe as linpaul.com's nav (styles/globals.css
// .site-nav a): no fill, no border. Current page = accent color + underline,
// inactive hovers to underline. Font-size/gap match linpaul's numbers
// (--step--1, from design-system/tokens.css) at the sm breakpoint; below it
// the padding tightens. Nav items never shrink or scroll - the wordmark
// truncates instead, since a working nav matters more on a phone than a
// full brand name. The whole masthead is still meant to look like one
// component across all three sites at desktop width.
const CHIP =
    "shrink-0 px-1.5 py-[0.2rem] text-[length:var(--step--1)] transition-colors sm:px-2.5";

// The one place an accent touches the masthead: each word of the wordmark
// gets one of the accents, cycling. Same idea as oneoneone's "one one one".
const WORDMARK_ACCENTS = ["text-cyan", "text-red", "text-iris", "text-navy"];

export function Masthead() {
    return (
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-2 bg-paper px-4 sm:gap-3 sm:px-10">
            <NavLink
                to="/"
                className="-my-2 min-w-0 shrink truncate py-2 text-[length:var(--step-0)] leading-[1.15] tracking-[-0.01em] sm:text-[length:var(--step-1)]"
            >
                {SITE_NAME.split(" ").map((word, i) => (
                    <span
                        key={i}
                        className={WORDMARK_ACCENTS[i % WORDMARK_ACCENTS.length]}
                    >
                        {i > 0 ? " " : ""}
                        {word}
                    </span>
                ))}
            </NavLink>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-[0.35rem]">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                            `${CHIP} ${
                                isActive
                                    ? "text-link underline"
                                    : "text-ink hover:underline"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>
        </header>
    );
}
