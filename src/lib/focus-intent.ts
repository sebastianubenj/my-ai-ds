let installed = false;

function setFocusIntent(intent: "pointer" | "keyboard") {
  document.documentElement.dataset.focusIntent = intent;
}

function installFocusIntent() {
  if (installed || typeof document === "undefined") return;
  installed = true;

  setFocusIntent("pointer");

  document.addEventListener("pointerdown", () => setFocusIntent("pointer"), true);
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Tab") setFocusIntent("keyboard");
    },
    true,
  );
}

installFocusIntent();
