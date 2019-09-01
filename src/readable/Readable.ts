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

  _isEqualTo(them: A) {
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
   * It will use the string litteral passed to it and concat it to the previous one
   * ex:
   * ```js
   * r(true)         `My value`
   *   .map(b => !b) `mapped by not`
   * ```
   * will print "My value mapped by not", and contain `false`.
   *
   * It is possible to place the initial readable somewhere esle with the string {0}
   *  ex:
   * ```js
   * r(true)         `my value`
   *   .map(b => !b) `When not {0},`
   * ```
   * will print "When not my value", and contain `false`.
   */
  map<B>(fn: (a: A) => B) {
    return (literals: TemplateStringsArray): Readable<B> => {
      const result = fn(this.it);
      const nextReadable = literals[0].includes("{0}")
        ? literals[0].split("{0}").join(this.itsName)
        : `${this.itsName} ${literals[0]}`;
      return new Readable(result, nextReadable);
    };
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
   *   ._s("name") `NAME`
   * ```
   * will print "John's NAME", and evaluates to `john.name`
   */
  _s(key: keyof A) {
    return (literals: TemplateStringsArray): Readable<A[keyof A]> => {
      const value = this.it[key];
      return new Readable(value, `${this.itsName}'s ${literals[0]}`);
    };
  }

  _append() {
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
