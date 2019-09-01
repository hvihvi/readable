import { r } from "./Readable";

describe("isTrue", () => {
  it("should return true if is truthy", () => {
    const result = r("truthy string")`my input`.isTrue();
    expect(result.print()).toBe("my input is true");
    expect(result.eval()).toBe(true);
  });
  it("should return false if is falsy", () => {
    const result = r(undefined)`my input`.isTrue();
    expect(result.print()).toBe("my input is not true");
    expect(result.eval()).toBe(false);
  });
});

describe("isFalse", () => {
  it("should return true if is falsy", () => {
    const result = r("")`my falsy input`.isFalse();
    expect(result.print()).toBe("my falsy input is false");
    expect(result.eval()).toBe(true);
  });
  it("should return false if is truthy", () => {
    const result = r(true)`my truthy input`.isFalse();
    expect(result.print()).toBe("my truthy input is not false");
    expect(result.eval()).toBe(false);
  });
});

describe("isEqualTo", () => {
  it("should be true when values are equal", () => {
    const result = r(true)``.isEqualTo(r(true)`something else`);
    expect(result.print()).toBe("true is equal to something else");
    expect(result.eval()).toBe(true);
  });
  it("should be false when values are not equal", () => {
    const result = r(true)``.isEqualTo(r(false)`something else`);
    expect(result.print()).toBe("true is not equal to something else");
    expect(result.eval()).toBe(false);
  });
});

describe("_isEqualTo", () => {
  it("should be true when values are equal", () => {
    const result = r(true)``._isEqualTo(true)`something else`;
    expect(result.print()).toBe("true is equal to something else");
    expect(result.eval()).toBe(true);
  });
  it("should be false when values are not equal", () => {
    const result = r(true)``._isEqualTo(false)`something else`;
    expect(result.print()).toBe("true is not equal to something else");
    expect(result.eval()).toBe(false);
  });
});

describe("and", () => {
  it("should be true when both are true", () => {
    const result = r(true)``.and(r(true)``);
    expect(result.print()).toBe("true and true");
    expect(result.eval()).toBe(true);
  });
  it("should be false when one is true", () => {
    const result = r(true)``.and(r(false)``);
    expect(result.print()).toBe("true and false");
    expect(result.eval()).toBe(false);
  });
});

describe("or", () => {
  it("should be true when on is true", () => {
    const result = r(true)``.or(r(false)``);
    expect(result.print()).toBe("true or false");
    expect(result.eval()).toBe(true);
  });
  it("should be false when both are false", () => {
    const result = r(false)``.or(r(false)``);
    expect(result.print()).toBe("false or false");
    expect(result.eval()).toBe(false);
  });
});

describe("map", () => {
  it("should concat readable values and apply function", () => {
    const result = r(true)  `it`
      .map(b => !b)         `mapped by not`;
    expect(result.print()).toBe("it mapped by not");
    expect(result.eval()).toBe(false);
  });
  it("should position previous readable where {0} is", () => {
    const not = b => !b;
    const result = r(true)  `true boolean`
      .map(not)             `when not {0} ...`;
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
    const result = r(true)``
      .apply(r((b: boolean) => !b)`negation`)
      .isEqualTo(r(false)``);
    expect(result.print()).toBe("true mapped by negation is equal to false");
    expect(result.eval()).toBe(true);
  });
  it("should apply and print function", () => {
    const result = r(true)``
      .apply(r((b: boolean) => !b)``)
      .isEqualTo(r(false)``);
    expect(result.print()).toBe("true mapped by (b) => !b is equal to false");
    expect(result.eval()).toBe(true);
  });
});

describe("_map", () => {
  it("should use the template litteral passed to mapr to describe the function", () => {
    const result = r(true)`my input`._map(b => !b)`not`;
    expect(result.print()).toBe("my input mapped by not");
    expect(result.eval()).toBe(false);
  });
});

describe("s", () => {
  it("should access value via key with s", () => {
    interface Person {
      name: string;
    }
    const john: Person = {
      name: "Doe"
    };
    const result = r(john)`John`.s("name");
    expect(result.print()).toBe("John's name");
    expect(result.eval()).toBe("Doe");
  });
  it("should access deep value via key with s chains", () => {
    interface Person {
      name: { firstname: string; lastname: string };
    }
    const john = {
      name: {
        firstname: "John",
        lastname: "Doe"
      }
    };
    const result = r(john)`John`.s("name").s("lastname");
    expect(result.print()).toBe("John's name's lastname");
    expect(result.eval()).toBe("Doe");
  });
});

describe("_s", () => {
  it("should access value via key with s", () => {
    interface Person {
      name: string;
    }
    const john: Person = {
      name: "Doe"
    };
    const result = r(john)`John`._s("name")`NAME`;
    expect(result.print()).toBe("John's NAME");
    expect(result.eval()).toBe("Doe");
  });
  it("should access deep value via key with s chains", () => {
    interface Person {
      name: { firstname: string; lastname: string };
    }
    const john = {
      name: {
        firstname: "John",
        lastname: "Doe"
      }
    };
    const result = r(john)`John`._s("name")`NAME`._s("lastname")`LAST NAME`;
    expect(result.print()).toBe("John's NAME's LAST NAME");
    expect(result.eval()).toBe("Doe");
  });
});

describe("_append", () => {
  it("should append a string to the readable value and keep the value", () => {
    const result = r(false)`my value`._append()`:D`;
    expect(result.print()).toBe("my value :D");
    expect(result.eval()).toBe(false);
  });
});
