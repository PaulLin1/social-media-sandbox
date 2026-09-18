import { useNavigate } from "react-router";
import { Dropdown } from "~/components/Dropdown";
import { EXPERIMENTS, type ExperimentSlug } from "~/experiments";

/**
 * Real navigation between the feed experiments - unlike FeedSettings (the
 * channel pages' masonry/ambient toggle, which is local component state),
 * this switches the URL, so each mode is its own bookmarkable page.
 */
export function FeedModeSwitch({ active }: { active: ExperimentSlug }) {
    const navigate = useNavigate();

    return (
        <Dropdown
            value={active}
            ariaLabel="Feed view"
            options={EXPERIMENTS.map((exp) => ({ value: exp.slug, label: exp.name }))}
            onChange={(slug) => {
                const next = EXPERIMENTS.find((exp) => exp.slug === slug);
                if (next) navigate(next.path);
            }}
        />
    );
}
