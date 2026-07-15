import { SVGProps } from "react";

/**
 * Umi Accessories brand mark — a red braided-cord bracelet with an
 * evil-eye charm bead, set on a dark circular frame (matches the
 * product photography used across the brand).
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
      {/* dark circular frame */}
      <circle cx="50" cy="50" r="49" fill="#141414" />
      <circle cx="50" cy="50" r="49" fill="none" stroke="#2a2a2a" strokeWidth="1" />

      {/* loose cord ends at the top, like a tied bracelet */}
      <path
        d="M40 20 C 34 14, 30 10, 26 6"
        fill="none"
        stroke="#c81e2c"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M60 20 C 66 14, 70 10, 74 6"
        fill="none"
        stroke="#c81e2c"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="26" cy="6" r="1.8" fill="#8f1420" />
      <circle cx="74" cy="6" r="1.8" fill="#8f1420" />

      {/* small hardware loops near the ties */}
      <circle cx="38" cy="23" r="2.4" fill="none" stroke="#c9a04f" strokeWidth="1.4" />
      <circle cx="62" cy="23" r="2.4" fill="none" stroke="#c9a04f" strokeWidth="1.4" />

      {/* braided cord ring */}
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke="#c81e2c"
        strokeWidth="11"
      />
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke="#8f1420"
        strokeWidth="11"
        strokeDasharray="3.4 5.2"
      />
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke="#e64a52"
        strokeWidth="2"
        strokeDasharray="2.6 6"
        transform="rotate(8 50 50)"
      />
      <circle
        cx="50"
        cy="50"
        r="39.5"
        fill="none"
        stroke="#8f1420"
        strokeWidth="1.2"
        opacity="0.6"
      />
      <circle
        cx="50"
        cy="50"
        r="28.5"
        fill="none"
        stroke="#8f1420"
        strokeWidth="1.2"
        opacity="0.6"
      />

      {/* evil-eye charm bead */}
      <circle cx="50" cy="50" r="14" fill="#f4f1ea" />
      <circle cx="50" cy="50" r="11.2" fill="#1c6fa8" />
      <circle cx="50" cy="50" r="7.4" fill="#f4f1ea" />
      <circle cx="50" cy="50" r="3.6" fill="#12181c" />
      <circle cx="47.3" cy="47.3" r="1.3" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}
