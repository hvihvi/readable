class Readable<A> {
  it: A;
  itsName: string;

  constructor(it: A, itsName: string) {
    this.it = it;
    this.itsName = itsName;
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
   * r(true)                   `my value`
   *   .apply(r(b => !b)`not`) `{1} applied to {0}`
   * ```
   * will print "not applied to my value", and contain `false`.
   */
  apply<B>(fn: Readable<(it: A) => B>) {
    return (literals: TemplateStringsArray): Readable<B> => {
      const result = fn.it(this.it);
      var nextReadable = literals[0].includes("{1}")
        ? literals[0].split("{1}").join(fn.itsName)
        : literals[0];
      nextReadable = nextReadable.includes("{0}")
        ? nextReadable.split("{0}").join(this.itsName)
        : `${this.itsName} ${nextReadable}`;
      return new Readable(result, nextReadable);
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
