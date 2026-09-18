import { useEffect, useRef } from "react";

// Drives the `.accent-card` border snake's `--rotate` custom property (see
// app.css) from JS instead of a CSS `animation`, because a CSS animation
// removed on mouse-leave snaps `--rotate` straight to its resting value
// instead of transitioning - verified across two different implementations
// of the effect, not just this one. Tracking the angle here and setting it
// via `style.setProperty` each frame is an ordinary property mutation, so
// the `transition` declared on `.accent-card::after` in app.css reliably
// picks it up for the counterclockwise snake back to rest.
const DEGREES_PER_SECOND = 360 / 4; // one revolution every 4s while hovered

export function useAccentSnake<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const frameRef = useRef<number | null>(null);
    const rotationRef = useRef(0);

    const stop = () => {
        if (frameRef.current != null) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        ref.current?.style.setProperty("--rotate", "0deg");
    };

    const start = () => {
        if (frameRef.current != null) return;
        let last = performance.now();
        const tick = (now: number) => {
            const dt = (now - last) / 1000;
            last = now;
            rotationRef.current = (rotationRef.current + dt * DEGREES_PER_SECOND) % 360;
            ref.current?.style.setProperty("--rotate", `${rotationRef.current}deg`);
            frameRef.current = requestAnimationFrame(tick);
        };
        frameRef.current = requestAnimationFrame(tick);
    };

    // Cancel a pending frame if the card unmounts mid-hover (e.g. navigating
    // away by clicking it).
    useEffect(() => stop, []);

    // The arc's angular width that makes it span this card's own top edge
    // without touching either rounded corner - a fixed angle can't work
    // across the grid, since every card shares the same column width but
    // each has a different height driven by its own image, and the angle a
    // top edge subtends from a conic-gradient's center depends on both.
    // Stopping exactly at the sharp corner (width/2, height/2) still clips
    // into the start of the curve, since the physical rounding begins
    // slightly before that point - subtracting the card's own radius
    // (tokens.css's --radius, 8px) from the half-width first stops the lit
    // region right at the end of the straight edge instead, so both ends
    // are a flat cut with no curve at all. A ResizeObserver keeps it correct
    // as the card's real size settles (the image loading in changes its
    // height after mount).
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const CARD_RADIUS_PX = 8; // tokens.css's --radius: 0.5rem

        const update = () => {
            const { width, height } = el.getBoundingClientRect();
            if (width === 0 || height === 0) return;
            const halfAngle =
                Math.atan2(width / 2 - CARD_RADIUS_PX, height / 2) * (180 / Math.PI);
            el.style.setProperty("--arc-width", `${halfAngle * 2}deg`);
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return {
        ref,
        onMouseEnter: start,
        onFocus: start,
        onMouseLeave: stop,
        onBlur: stop,
    };
}
