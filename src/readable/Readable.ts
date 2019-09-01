/**
 * concatenates template literals passed as function params
 * example usage:
 * ```js
 * const fn = (literals, ...placeholders) => concatTemplateLiterals(literals, ...placeholders)
 * fn`a${1}b${2}c` // returns "a1b2c"
 *
 */
const concatTemplateLiterals = (
  literals: TemplateStringsArray,
  ...placeholders: string[]
) => {
  var result = literals[0];
  for (var i = 0; i < placeholders.length; ++i) {
    result += placeholders[i] + literals[i + 1];
  }
  return result;
};

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
   * It is possible to place the initial readable somewhere esle with the string {it}
   *  ex:
   * ```js
   * r(true)         `my value`
   *   .map(b => !b) `When not {it},`
   * ```
   * will print "When not my value", and contain `false`.
   */
  map<B>(fn: (a: A) => B) {
    return (
      literals: TemplateStringsArray,
      ...placeholders: string[]
    ): Readable<B> => {
      console.log(...placeholders);
      const passedReadable = concatTemplateLiterals(literals, ...placeholders);

      const result = fn(this.it);
      const nextReadable = passedReadable.includes("{it}")
        ? passedReadable.split("{it}").join(this.itsName)
        : `${this.itsName} ${passedReadable}`;

      return new Readable(result, nextReadable);
    };
  }

  /**
   * Applies and flattens a function that returns a Readable
   * ex:
   * ```js
   * const negation = b => r(!b)`not himself`
   * r(true)         `my value`
   *   .flatMap(not) `This is {it} flat mapped to {this}`
   * ```
   * will print "This is my value flat mapped to not himself", and contain `false`.
   */
  flatMap<B>(fn: (it: A) => Readable<B>) {
    return (literals: TemplateStringsArray): Readable<B> => {
      const result = fn(this.it);
      var nextReadable = literals[0].includes("{this}")
        ? literals[0].split("{this}").join(result.itsName)
        : literals[0];
      nextReadable = nextReadable.includes("{it}")
        ? nextReadable.split("{it}").join(this.itsName)
        : `${this.itsName} ${nextReadable}`;
      return new Readable(result.it, nextReadable);
    };
  }

  /**
   * Applies a readable function
   * ex:
   * ```js
   * const negation = r(b => !b)`negation`
   *
   * r(true)            `my value`
   *   .apply(negation) `{this} applied to {it}`
   * ```
   * will print "negation applied to my value", and contain `false`.
   */
  apply<B>(fn: Readable<(it: A) => B>) {
    return (literals: TemplateStringsArray): Readable<B> => {
      const result = fn.it(this.it);
      var nextReadable = literals[0].includes("{this}")
        ? literals[0].split("{this}").join(fn.itsName)
        : literals[0];
      nextReadable = nextReadable.includes("{it}")
        ? nextReadable.split("{it}").join(this.itsName)
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

export const r = <A>(it: A) => (
  literals: TemplateStringsArray,
  ...placeholders: string[]
): Readable<A> => {
  const readable = concatTemplateLiterals(literals, ...placeholders);
  return readable
    ? new Readable<A>(it, readable)
    : new Readable(it, String(it));
};
