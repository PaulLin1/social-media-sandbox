import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // Masonry is home - no hub/landing page in between. Switching to Ambient
    // happens via FeedModeSwitch, present on both feed pages; a separate page
    // just to pick one was redundant with it. Dynamic Graph now lives inside
    // Search instead of as its own feed (search/search.tsx).
    index("routes/feeds.masonry.tsx"),
    route("feeds/ambient", "routes/feeds.ambient.tsx"),
    route("i/:id", "routes/image.tsx"),
    route("p/:id", "routes/picture.tsx"),
    route("search", "routes/search.tsx"),
    route("ambient", "routes/ambient.tsx"),
    route("explore/:id", "routes/explore.tsx"),
    route("channels", "routes/channels.tsx"),
    route("channels/:id", "routes/channel.tsx"),
    route("about", "routes/about.tsx"),
] satisfies RouteConfig;
