# readablejs

A monad wrapper to extract readable strings from your code's logic.

Examples:

```js
const value = true;
const not = b => !b;

r(value)`My value`
  .map(not)
  .isFalse()
  .print(); // returns "My value mapped by not is false"
```

```js
const value = {firstname: "John", lastname: "Doe"};

r(value)`John Doe`
  .s("lastname")
  .mapr(toUpperCase)`to upper case`
  .isEqualTo("DOE")
  .print(); // returns "John Doe's lastname mapped by to upper case is equal to DOE"
```

Installation :

`npm install readablejs`

or with yarn:

`yarn add readablejs`

Then import `r`:

```js
import r from "readablejs";
```
