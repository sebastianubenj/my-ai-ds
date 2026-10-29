export default function App() {
  return (
    <div
      className={`flex min-h-dvh flex-col items-center justify-center
        px-(--primitives-spacing-8)
        [background-color:var(--semantics-colors-background-page)]
        [color:var(--semantics-colors-foreground-default)]`}
    >
      <p
        className={`m-0 max-w-(--primitives-max-width-max-w-md) text-center font-sans
          [font-weight:var(--semantics-typography-body-font-weight)]
          text-(length:--semantics-typography-body-body-lg-font-size)
          leading-(--semantics-typography-body-body-lg-lh-normal)
          tracking-(--semantics-typography-body-body-lg-tracking-tight)`}
      >
        The catalog is Storybook. Run{" "}
        <code className="font-sans">npm run storybook</code> and open{" "}
        <a href="http://localhost:6006">localhost:6006</a>
        .
      </p>
    </div>
  );
}
