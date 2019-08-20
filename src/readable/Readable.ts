class Readable<A> {
  it: A;
  itsName: string;

  constructor(it: A, itsName: string) {
    this.it = it;
    this.itsName = itsName;
  }

  isTrue(): Readable<boolean> {
    return this.it
      ? new Readable(!!this.it, `${this.itsName} is true`)
      : new Readable(!!this.it, `${this.itsName} is not true`);
  }

  isFalse(): Readable<boolean> {
    return !this.it
      ? new Readable(!this.it, `${this.itsName} is false`)
      : new Readable(!this.it, `${this.itsName} is not false`);
  }

  isEqualTo(them: Readable<A>): Readable<boolean> {
    const isEqual = this.it === them.it;
    return new Readable(
      isEqual,
      `${this.itsName} is ${isEqual ? "" : "not "}equal to ${them.itsName}`
    );
  }

  isEqualTor(them: A) {
    return (literals: TemplateStringsArray): Readable<boolean> => {
      const isEqual = this.it === them;
      return new Readable(
        isEqual,
        `${this.itsName} is ${isEqual ? "" : "not "}equal to ${literals[0]}`
      );
    };
  }

  and<B>(them: Readable<B>): Readable<boolean> {
    return new Readable(
      !!this.it && !!them.it,
      `${this.itsName} and ${them.itsName}`
    );
  }

  or<B>(them: Readable<B>): Readable<boolean> {
    return new Readable(
      !!this.it || !!them.it,
      `${this.itsName} or ${them.itsName}`
    );
  }

  /**
   * Applies the passed function to the Readable value and returns a Readable of the mapped value
   * It will use the function's name or print it if it is an anonymous function
   * ex:
   * ```js
   * const not = b => !b
   * r(true)`My value`
   *   .map(not)
   * ```
   *
   * will print "My value mapped by not", and contain `false`.
   * ex:
   * ```js
   * r(true)`My value`
   *   .map(b => !b)
   * ```
   * will print "My value mapped by b => !b", and contain `false`.
   */
  map<B>(fn: (it: A) => B): Readable<B> {
    const fnName = fn.name ? fn.name : fn;
    return new Readable(fn(this.it), `${this.itsName} mapped by ${fnName}`);
  }

  /**
   * Applies and flattens a function that returns a Readable
   * ex:
   * ```js
   * r(true)`My value`
   *   .flatMap(b => r(!b)`not`)
   * ```
   * will print "My value mapped by not", and contain `false`.
   */
  flatMap<B>(fn: (it: A) => Readable<B>): Readable<B> {
    const result = fn(this.it);
    return new Readable(
      result.it,
      `${this.itsName} mapped by ${result.itsName}`
    );
  }

  /**
   * Applies a readable function
   * ex:
   * ```js
   * r(true)`My value`
   *   .apply(r(b => !b)`not`)
   * ```
   * will print "My value mapped by not", and contain `false`.
   */
  apply<B>(them: Readable<(it: A) => B>): Readable<B> {
    const result = them.it(this.it);
    return new Readable(result, `${this.itsName} mapped by ${them.itsName}`);
  }

  /**
   * Same as Readable#map except you can pass template literals to mapr, to add a readable name to your anonymous function.
   * Enables easier to read indentations.
   * ex:
   * ```js
   * r(true)          `My value`
   *   .mapr(b => !b) `not`
   * ```
   * will print "My value mapped by not", and contain `false`.
   */
  mapr<B>(fn: (a: A) => B) {
    return (literals: TemplateStringsArray): Readable<B> => {
      return this.flatMap(o => new Readable(fn(o), literals[0]));
    };
  }

  /**
   * Access a key of the Readable object
   * ex:
   * ```js
   * r(john)`John`
   *   .s("name")
   * ```
   * will print "John's name", and evaluates to `john.name`
   */
  s(key: keyof A): Readable<A[keyof A]> {
    const value = this.it[key];
    return new Readable(value, `${this.itsName}'s ${key}`);
  }

  /**
   * Access a key of the Readable object
   * ex:
   * ```js
   * r(john)       `John`
   *   .sr("name") `NAME`
   * ```
   * will print "John's NAME", and evaluates to `john.name`
   */
  sr(key: keyof A) {
    return (literals: TemplateStringsArray): Readable<A[keyof A]> => {
      const value = this.it[key];
      return new Readable(value, `${this.itsName}'s ${literals[0]}`);
    };
  }

  appendr() {
    return (literals: TemplateStringsArray): Readable<A> => {
      return new Readable(this.it, `${this.itsName} ${literals[0]}`);
    };
  }

  eval(): A {
    return this.it;
  }

  print(): string {
    return this.itsName;
  }
}

export const r = <A>(it: A) => (literals: TemplateStringsArray): Readable<A> =>
  literals[0] ? new Readable<A>(it, literals[0]) : new Readable(it, String(it));
