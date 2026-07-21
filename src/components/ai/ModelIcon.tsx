"use client";

/** Brand logo for a model, resolved from its id/name/repo (see src/lib/ai/modelIcons.ts). */
import { modelIcon } from "@/lib/ai/modelIcons";

const TILE = { sm: "size-6 rounded-md", md: "size-8 rounded-lg", lg: "size-9 rounded-lg" } as const;
const GLYPH = { sm: "size-3.5", md: "size-5", lg: "size-5" } as const;

export default function ModelIcon({ hints, size = "md", className = "" }: {
  /** Anything identifying: catalog id, display name, `owner/repo`. First match wins. */
  hints: (string | undefined | null)[];
  size?: keyof typeof TILE;
  className?: string;
}) {
  const icon = modelIcon(...hints);
  return (
    // Fixed light chip in both themes: every brand logo is drawn for a light background (several are
    // solid black), and an <img> can't recolor them. Inverting in dark mode would hue-shift the ones
    // that mix black with a brand accent, so the chip stays light instead.
    <span className={`flex shrink-0 items-center justify-center border border-black/10 bg-white ${TILE[size]} ${className}`}>
      <img src={icon.src} alt="" draggable={false} className={`${GLYPH[size]} object-contain`} />
    </span>
  );
}
