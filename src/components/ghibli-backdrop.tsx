/**
 * A fixed, decorative backdrop of soft watercolor-style blobs in sky-blue,
 * sun-gold, and forest-green — evoking the painterly skies of Studio Ghibli
 * without ever competing with content. Purely visual, no interactivity.
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
          background: "var(--color-gold-soft)",
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
