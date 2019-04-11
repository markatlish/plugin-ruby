describe("break", () => {
  test("empty break", () => {
    expect("break").toMatchFormat();
  });

  test("break with one argument, no parens", () => {
    expect("break 1").toMatchFormat();
  });

  test("break with parens drops parens", () => {
    expect("break(1)").toChangeFormat("break 1");
  });

  test("break with multiple arguments", () => {
    expect("break 1, 2, 3").toMatchFormat();
  });
});
