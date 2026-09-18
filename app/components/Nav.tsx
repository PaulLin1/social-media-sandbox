import { type SVGProps } from "react";
import { Link, NavLink } from "react-router";
import { SITE_NAME } from "~/site";

// One sidebar (sm and up) / bottom tab bar (below sm) instead of the old top
// masthead + floating per-page mode switches - those stacked into a "double
// nav bar" once a page also had its own Masonry/Ambient/Dynamic Graph switch.
// This is the app's only persistent chrome; its width (w-60/15rem) is
// load-bearing - every page's <main> sits inside root.tsx's `sm:pl-60`
// content wrapper, and anything that uses `fixed` (so it escapes that
// padding) compensates with its own `sm:left-60`.
//
// Monochrome on purpose (a per-item color-coded icon chip read as tacky in
// review) - current item is just weight + a plain gray active-row fill, same
// restrained language as the rest of the chrome.
//
// About is deliberately not one of these: on the sidebar it sits below a
// divider as a smaller secondary link (see the `<footer>` below), same
// pattern as Settings/Help in most sidebar-nav apps. The mobile bottom bar
// has no equivalent secondary tier - there's no room for one at that
// width - so it keeps all four destinations flat.
const mainNavItems = [
    { name: "Feeds", to: "/", icon: HomeIcon },
    { name: "Search", to: "/search", icon: SearchIcon },
    { name: "Channels", to: "/channels", icon: GridIcon },
];
const mobileNavItems = [...mainNavItems, { name: "About", to: "/about", icon: InfoIcon }];

export function Nav() {
    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-rule bg-paper px-3 py-5 sm:flex">
                <Link to="/" className="mb-5 px-3 text-base leading-snug font-semibold text-ink">
                    {SITE_NAME}
                </Link>

                <nav className="flex flex-col gap-1">
                    {mainNavItems.map(({ name, to, icon: Icon }) => (
                        <NavLink
                            key={name}
                            to={to}
                            end={to === "/"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] transition-colors ${
                                    isActive
                                        ? "bg-wash font-medium text-ink"
                                        : "text-ink-soft hover:bg-wash hover:text-ink"
                                }`
                            }
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            {name}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto border-t border-rule pt-3">
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                                isActive
                                    ? "font-medium text-ink"
                                    : "text-ink-soft hover:text-ink"
                            }`
                        }
                    >
                        <InfoIcon className="h-[18px] w-[18px]" />
                        About
                    </NavLink>
                </div>
            </aside>

            <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-rule bg-paper sm:hidden">
                {mobileNavItems.map(({ name, to, icon: Icon }) => (
                    <NavLink
                        key={name}
                        to={to}
                        end={to === "/"}
                        aria-label={name}
                        className={({ isActive }) =>
                            `flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                                isActive ? "bg-wash text-ink" : "text-ink-soft"
                            }`
                        }
                    >
                        <Icon className="h-5 w-5" />
                    </NavLink>
                ))}
            </nav>
        </>
    );
}

// Small hand-rolled line icons (24x24, stroke currentColor) - no icon
// package, since these four are all the app needs.
function HomeIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M3.5 10.5 12 3.5l8.5 7" />
            <path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.5" />
        </svg>
    );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-3.8-3.8" />
        </svg>
    );
}

function GridIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinejoin="round"
            {...props}
        >
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
    );
}

function InfoIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 11v5.5" />
            <path d="M12 7.75h.01" />
        </svg>
    );
}
