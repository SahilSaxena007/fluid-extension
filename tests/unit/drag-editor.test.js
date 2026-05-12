const { snapValue } = require("../../content/drag-editor");

describe("drag editor helpers", () => {
  test("snaps values to the nearest grid unit", () => {
    expect(snapValue(123, 10)).toBe(120);
    expect(snapValue(126, 10)).toBe(130);
  });

  test("snaps negative values consistently", () => {
    expect(snapValue(-14, 10)).toBe(-10);
  });
});
