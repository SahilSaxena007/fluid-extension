const {
  PRESETS,
  declarationsToCss,
  generateCSS,
  toCssProperty
} = require("../../content/layout-engine");

describe("preset css generation", () => {
  test("defines the four v1 presets", () => {
    expect(Object.keys(PRESETS).sort()).toEqual([
      "checklist",
      "executive",
      "focus",
      "task-first"
    ]);
  });

  test("converts style declarations into important css", () => {
    expect(toCssProperty("zIndex")).toBe("z-index");
    expect(declarationsToCss({ pointerEvents: "none" })).toContain("pointer-events: none !important;");
  });

  test("generates css for every panel in a preset", () => {
    const css = generateCSS("task-first");

    expect(css).toContain('[data-fluid-panel="panel-sidebar-left"]');
    expect(css).toContain('[data-fluid-panel="panel-inbox"]');
    expect(css).toContain("transition: all 300ms ease !important;");
  });

  test("returns an empty string for unknown presets", () => {
    expect(generateCSS("missing")).toBe("");
  });

  test("focus preset minimizes sidebars without removing compose", () => {
    const css = generateCSS("focus");

    expect(css).toContain('[data-fluid-panel="panel-sidebar-left"]');
    expect(css).toContain("width: 48px !important;");
    expect(css).toContain('[data-fluid-panel="panel-compose"]');
  });
});
