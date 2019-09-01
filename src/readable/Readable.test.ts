import { r } from "./Readable";

describe("map", () => {
  it("should concat readable values and apply function", () => {
    const result = r(true)`it`.map(b => !b)`mapped by not`;
    expect(result.print()).toBe("it mapped by not");
    expect(result.eval()).toBe(false);
  });
  it("should position previous readable where {0} is", () => {
    const not = b => !b;
    const result = r(true)`true boolean`.map(not)`when not {0} ...`;
    expect(result.print()).toBe("when not true boolean ...");
    expect(result.eval()).toBe(false);
  });
  it("should be distributive", () => {
    const add1 = b => b + 1;
    const toStringExcl = b => String(b) + "!!!";
    const bothFunctions = it => toStringExcl(add1(it));
    const result1 = r(1)`1`.map(add1)`mapped by add1`.map(
      toStringExcl
    )`mapped by toStringExcl`;
    const result2 = r(1)`1`.map(bothFunctions)`mapped by both functions`;
    expect(result1.print()).toBe("1 mapped by add1 mapped by toStringExcl");
    expect(result1.eval()).toBe("2!!!");
    expect(result2.print()).toBe("1 mapped by both functions");
    expect(result2.eval()).toBe("2!!!");
    expect(result2.eval()).toBe(result1.eval());
  });
});

describe("flatMap", () => {
  it("should accept a function that returns a Readable", () => {
    const result = r(true)``.flatMap(b => r(!b)`not`);
    expect(result.print()).toBe("true mapped by not");
    expect(result.eval()).toBe(false);
  });
  it("should apply the function to it", () => {
    const not = b => r(!b)`not`;
    const input = true;
    const result = r(input)``.flatMap(not);
    expect(result.print()).toBe("true mapped by not");
    expect(result.eval()).toBe(false);
  });
});

describe("apply", () => {
  it("should apply function", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true)`true`.apply(negation)`mapped by negation`;
    expect(result.eval()).toBe(false);
  });
  it("should concat with the previous readable", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true)`true`.apply(negation)`mapped by negation`;
    expect(result.print()).toBe("true mapped by negation");
  });
  it("should concat the previous readable when {0} is passed", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true)`true`.apply(negation)`negation applied to {0}`;
    expect(result.print()).toBe("negation applied to true");
  });
  it("should concat the previous readable when {1} is passed", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true)`true`.apply(negation)`when applying {1}`;
    expect(result.print()).toBe("true when applying negation");
  });
  it("should concat the previous readable and the function readable when {0} and {1} is passed", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true)`true`.apply(negation)`{1} applied to {0}`;
    expect(result.print()).toBe("negation applied to true");
  });
});
