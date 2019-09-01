# readablejs

A monad wrapper to extract readable strings from your code's logic.

Examples:

```js
const value = {innerValue: true};
const not = b => !b;

r(value)`My value`
  .s("innerValue")
  .map(not)
  .isFalse()
  .print(); // returns "My value's innerValue mapped by not is false"
```

You can also use the "_" version to indent the readable part nicely:
```js
const value = {firstname: "John", lastname: "Doe"};

r(value)               `John Doe`
  ._s("lastname")       `last name`
  ._map(toUpperCase)    `to upper case`
  ._isEqualTo("sdfsd")  `random keyboad inputs`
  ._append()           `:)`
  .print(); // returns "John Doe's last name mapped by to upper case is not equal to random keyboard inputs :)"
```

Installation :

`npm install readablejs`

or with yarn:

`yarn add readablejs`

Then import `r`:

```js
import r from "readablejs";
```
