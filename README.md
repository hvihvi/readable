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

You can also use the "r" version to indent the readable part nicely:
```js
const value = {firstname: "John", lastname: "Doe"};

r(value)                `John Doe`
  .sr("lastname")       `last name`
  .mapr(toUpperCase)    `to upper case`
  .isEqualTor("sdfsd")  `random keyboad inputs`
  .appendr()            `:)`
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
