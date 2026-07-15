/**
 * A fixed, decorative backdrop of soft watercolor-style blobs in seafoam
 * turquoise, coral sunset-glow, and seagrass green — evoking a painterly
 * Miyazaki seaside (Ponyo's tide pools, Kiki's coastal town) without ever
 * competing with content. Purely visual, no interactivity.
 */
export function GhibliBackdrop() {
  return (
    <div className="ghibli-backdrop" aria-hidden="true">
      <div
        className="ghibli-blob"
        style={{
          top: "-10%",
          left: "-8%",
          width: "38vw",
          height: "38vw",
          background: "var(--color-sky-soft)",
        }}
      />
      <div
        className="ghibli-blob"
        style={{
          top: "8%",
          right: "-12%",
          width: "32vw",
          height: "32vw",
          background: "var(--color-sunset-soft)",
          animationDelay: "-8s",
        }}
      />
      <div
        className="ghibli-blob"
        style={{
          bottom: "-14%",
          left: "18%",
          width: "40vw",
          height: "40vw",
          background: "var(--color-forest-soft)",
          animationDelay: "-14s",
        }}
      />
    </div>
  );
}
