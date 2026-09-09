// The registry of feed experiments - the single place that names, describes,
// and locates each mode. Adding a new experiment later is: one new route/page
// + one new entry here.

export type ExperimentSlug = "masonry" | "ambient" | "graph";

export type Experiment = {
    slug: ExperimentSlug;
    name: string;
    /** Where it lives - masonry is home ("/"), no separate hub page. */
    path: string;
    /** One line, for anywhere the experiments are listed. */
    tagline: string;
    /** 1-2 sentences on how it actually works - the mode's own page header. */
    blurb: string;
};

export const EXPERIMENTS: Experiment[] = [
    {
        slug: "masonry",
        name: "Masonry",
        path: "/",
        tagline: "The baseline scrolling grid.",
        blurb:
            "A masonry grid, infinite-loading, shuffled into a random order each session.",
    },
    {
        slug: "ambient",
        name: "Ambient",
        path: "/feeds/ambient",
        tagline: "The collection as a slow crossfade.",
        blurb:
            "Images swap in and out every second, each one held on screen for 15 seconds with animated fading.",
    },
    {
        slug: "graph",
        name: "Dynamic Graph",
        path: "/feeds/graph",
        tagline: "Browse by visual similarity, not time.",
        blurb:
            "A graph view of content inspired by t-SNE graphs. Click into one and the graph expands through its nearest visual neighbors from CLIP embeddings.",
    },
];

export function getExperiment(slug: ExperimentSlug): Experiment {
    const found = EXPERIMENTS.find((e) => e.slug === slug);
    if (!found) throw new Error(`Unknown experiment: ${slug}`);
    return found;
}
