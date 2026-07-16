/**
 * Shared mutable singleton for scroll story progress.
 * GSAP ScrollTrigger writes (0–1) and useFrame reads.
 * Keeping this in a separate file allows ScrollStoryScene to be fully lazy-loaded.
 */
export const storyScrollProgress = { current: 0 }
