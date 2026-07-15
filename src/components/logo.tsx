import { SVGProps } from "react";

/**
 * Umi Accessories brand mark — an anime/cel-shaded illustration of a red
 * knotted bracelet with a blue-and-white Turkish "evil eye" (nazar) charm
 * at its center. Flat color fills, bold ink outlines, and glossy highlight
 * streaks give it a hand-drawn Ghibli-esque look, set against the site's
 * ocean-pastel palette.
 */
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Umi Accessories logo"
      {...props}
    >
      {/* soft watercolor backdrop disc */}
      <circle cx="50" cy="50" r="49" fill="#d2edf1" />
      <circle cx="50" cy="50" r="49" fill="none" stroke="#1f3a3e" strokeWidth="1.4" opacity="0.25" />

      {/* sparkle accents, anime-style */}
      <path
        d="M14 22 L16.6 27.4 L22 30 L16.6 32.6 L14 38 L11.4 32.6 L6 30 L11.4 27.4 Z"
        fill="#fae3d2"
      />
      <path
        d="M85 65 L86.6 68.6 L90.2 70.2 L86.6 71.8 L85 75.4 L83.4 71.8 L79.8 70.2 L83.4 68.6 Z"
        fill="#f8ddd2"
      />

      {/* knotted cord ends at the top */}
      <path
        d="M38 21 C 31 15, 26 12, 21 8"
        fill="none"
        stroke="#1f3a3e"
        strokeWidth="5.4"
        strokeLinecap="round"
      />
      <path
        d="M62 21 C 69 15, 74 12, 79 8"
        fill="none"
        stroke="#1f3a3e"
        strokeWidth="5.4"
        strokeLinecap="round"
      />
      <path
        d="M38 21 C 31 15, 26 12, 21 8"
        fill="none"
        stroke="#e0785f"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M62 21 C 69 15, 74 12, 79 8"
        fill="none"
        stroke="#e0785f"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="21" cy="8" r="2.6" fill="#1f3a3e" />
      <circle cx="79" cy="8" r="2.6" fill="#1f3a3e" />

      {/* bracelet cord ring — bold ink outline, flat cel-shaded fill */}
      <circle cx="50" cy="50" r="34" fill="none" stroke="#1f3a3e" strokeWidth="15.5" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#e0785f" strokeWidth="12" />
      {/* knot texture ticks around the cord */}
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke="#c96449"
        strokeWidth="12"
        strokeDasharray="2.2 5.8"
      />
      {/* glossy cel-shade highlight streak on the cord, upper-left */}
      <path
        d="M27 34 A 34 34 0 0 1 46 17.5"
        fill="none"
        stroke="#f6b9a4"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* evil-eye (nazar) charm bead, anime cel-shaded */}
      <circle cx="50" cy="50" r="15.5" fill="#1f3a3e" />
      <circle cx="50" cy="50" r="14" fill="#f3faf9" />
      <circle cx="50" cy="50" r="10.6" fill="#1f3a3e" />
      <circle cx="50" cy="50" r="9.2" fill="#4ea6bb" />
      <circle cx="50" cy="50" r="5.4" fill="#f3faf9" />
      <circle cx="50" cy="50" r="3.6" fill="#1f3a3e" />
      <circle cx="50" cy="50" r="2.6" fill="#16303a" />
      {/* glossy highlight dot, classic anime eye-shine */}
      <circle cx="46.6" cy="46.4" r="1.9" fill="#ffffff" opacity="0.95" />
      <circle cx="53.4" cy="53.6" r="0.8" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}
