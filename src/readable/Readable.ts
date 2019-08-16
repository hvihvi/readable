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

  map<B>(fn: (it: A) => B): Readable<B> {
    const fnName = fn.name ? fn.name : fn;
    return new Readable(fn(this.it), `${this.itsName} mapped by ${fnName}`);
  }

  flatMap<B>(fn: (it: A) => Readable<B>): Readable<B> {
    const result = fn(this.it);
    return new Readable(
      result.it,
      `${this.itsName} mapped by ${result.itsName}`
    );
  }

  apply<B>(them: Readable<(it: A) => B>): Readable<B> {
    const result = them.it(this.it);
    return new Readable(result, `${this.itsName} mapped by ${them.itsName}`);
  }

  /**
   * same as map except you can pass template literals to mapr, to add a readable to your function
   */
  mapr<B>(fn: (a: A) => B) {
    return (literals: TemplateStringsArray): Readable<B> => {
      return this.flatMap(o => new Readable(fn(o), literals[0]));
    };
  }

  s(key: keyof A): Readable<A[keyof A]> {
    const value = this.it[key];
    return new Readable(value, `${this.itsName}'s ${key}`);
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
