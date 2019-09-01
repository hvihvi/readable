import { r } from "./Readable";

describe("map", () => {
  it("should concat readable values and apply function", () => {
    const result = r(true)  `it`
      .map(b => !b)         `mapped by not`;
    expect(result.print()).toBe("it mapped by not");
    expect(result.eval()).toBe(false);
  });
  it("should position previous readable where {it} is", () => {
    const not = b => !b;
    const result = r(true)  `true boolean`
      .map(not)             `when not {it} ...`;
    expect(result.print()).toBe("when not true boolean ...");
    expect(result.eval()).toBe(false);
  });
  it("should be distributive", () => {
    const add1 = b => b + 1;
    const toStringExcl = b => String(b) + "!!!";
    const bothFunctions = it => toStringExcl(add1(it));
    const result1 = r(1)  `1`
      .map(add1)          `mapped by add1`
      .map(toStringExcl)   `mapped by toStringExcl`;
    const result2 = r(1)  `1`
      .map(bothFunctions) `mapped by both functions`;
    expect(result1.print()).toBe("1 mapped by add1 mapped by toStringExcl");
    expect(result1.eval()).toBe("2!!!");
    expect(result2.print()).toBe("1 mapped by both functions");
    expect(result2.eval()).toBe("2!!!");
    expect(result2.eval()).toBe(result1.eval());
  });
  it("should accept multiple params in string litterals", () => {
    const anArray = [1, 2, 3];
    const filter1 = input => input.filter(it => it !== 1);
    const result = r(anArray)  `An array containing ${anArray} values`
      .map(filter1)            `when filtering 1 ...`;
    expect(result.print()).toBe("An array containing 1,2,3 values when filtering 1 ...");
    expect(result.eval()).toEqual([2, 3]);
  });
});

describe("flatMap", () => {
  it("should apply the function to it", () => {
    const not = b => r(!b)`not`;
    const input = true;
    const result = r(input)``.flatMap(not)``;
    expect(result.eval()).toBe(false);
  });
  it("should concat with the previous readable", () => {
    const not = b => r(!b)`not`;
    const result = r(true) `true`
    .flatMap(not)          `flatten to not`;
    expect(result.print()).toBe("true flatten to not");
  });
  it("should concat the previous readable when {it} is passed", () => {
    const not = b => r(!b)`not`;
    const result = r(true) `true`
    .flatMap(not)          `negation is applied to {it}`;
    expect(result.print()).toBe("negation is applied to true");
  });
  it("should concat the previous readable when {this} is passed", () => {
    const not = b => r(!b)`not`;
    const result = r(true) `true`
    .flatMap(not)          `flat mapped by {this}`;
    expect(result.print()).toBe("true flat mapped by not");
  });
  it("should replace when {it} and {this} is passed", () => {
    const not = b => r(!b)`not`;
    const result = r(true) `true`
    .flatMap(not)          `{this} is applied to {it}`;
    expect(result.print()).toBe("not is applied to true");
  });
});


describe("apply", () => {
  it("should apply function", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true) `true`
      .apply(negation)     `mapped by negation`;
    expect(result.eval()).toBe(false);
  });
  it("should concat with the previous readable", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true) `true`
      .apply(negation)     `mapped by negation`;
    expect(result.print()).toBe("true mapped by negation");
  });
  it("should concat the previous readable when {it} is passed", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true) `true`
      .apply(negation)     `negation applied to {it}`;
    expect(result.print()).toBe("negation applied to true");
  });
  it("should concat the previous readable when {this} is passed", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true) `true`
      .apply(negation)     `when applying {this}`;
    expect(result.print()).toBe("true when applying negation");
  });
  it("should concat the previous readable and the function readable when {it} and {this} is passed", () => {
    const negation = r((b: boolean) => !b)`negation`;
    const result = r(true) `true`
      .apply(negation)     `{this} applied to {it}`;
    expect(result.print()).toBe("negation applied to true");
  });
});
