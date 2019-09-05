# readablejs

A monad based on template literals to express your code's logic in human readable sentences.

Display error messages to users, share bussiness logic with non-tech people, compose and reuse sentences.

## API:

### map:

```js
const value = {firstname: "John", lastname: "Doe"};
const jack = "Jack";

r(value)                     `John Doe`
  .map(it => it.lastname)    `'s last name`
  .map(toUpperCase)          `to upper case`
  .map(it => it === jack)    `Is {it} equal to ${jack}?`
  .map(it=>it)               `:)`
  .read();
  // returns "Is John Doe's last name to upper case equal to Jack? :)"
  // contains "false"
```

**Note:** "{it}" will be replaced by the previous readable value, you can construct sentences around it. Otherwise, they are appended with a space.

### apply:

Give a readable value to functions with `apply` :

```js
const negation = r((b => !b)`negation`;

r(true)               `true`
  .apply(negation)    `{this} applied to {it}`
  // returns "negation applied to true"
  // contains "false"
```

**Note:** "{this}" will be replaced by the readable function's readable value.


### Read the value:

```js
const value = 4;
const readableValue = r(value) `Four`

readableValue.read() // returns "Four"
readableValue.get() // returns the number `4`

```

### flatMap:

```js
const value = {firstname: "John", lastname: "Doe"};
const getLastName = value => r(value.firstname)`firstname`

r(value)                      `John Doe`
  .flatMap(getLastName)       `{it}'s {this}`
  .read(); // returns "John Doe's firstname"
```

## Installation :

`npm install readablejs`

or with yarn:

`yarn add readablejs`

Then import `r`:

```js
import r from "readablejs";
```
