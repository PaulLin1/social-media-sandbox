import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // Masonry is home - no hub/landing page in between. Switching to Ambient
    // or Dynamic Graph happens via FeedModeSwitch, present on all three
    // feed pages; a separate page just to pick one was redundant with it.
    index("routes/feeds.masonry.tsx"),
    route("feeds/ambient", "routes/feeds.ambient.tsx"),
    route("feeds/graph", "routes/feeds.graph.tsx"),
    route("i/:id", "routes/image.tsx"),
    route("p/:id", "routes/picture.tsx"),
    route("search", "routes/search.tsx"),
    route("ambient", "routes/ambient.tsx"),
    route("explore/:id", "routes/explore.tsx"),
    route("channels", "routes/channels.tsx"),
    route("channels/:id", "routes/channel.tsx"),
    route("about", "routes/about.tsx"),
] satisfies RouteConfig;
