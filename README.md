# readablejs

A monad wrapper to extract readable strings from your code's logic.

## Examples:

### map:

```js
const value = {firstname: "John", lastname: "Doe"};
const jack = "Jack";

r(value)                      `John Doe`
  .map(it => it.lastname)     `'s last name`
  .map(toUpperCase)           `to upper case`
  .map(it => it === jack)     `Is {it} equal to ${jack}?`
  .map(it=>it)                `:)`
  .print();
  // returns "Is John Doe's last name to upper case equal to Jack? :)"
  // contains "false"
```

**Note:** "{it}" will be replaced by the previous readable value, you can construct sentences around it. Otherwise, they are appended with a space.

### apply:

Give a readable value to functions with `apply` :

```js
const value = {firstname: "John", lastname: "Doe"};
const getLastName = r(it => it.firstname)`Retrieve firstname`

r(value)                    `John Doe`
  .apply(getLastName)       `{this} applied to {it}`
  .print();
  // returns "Retrieve firstname applied to John Doe"
  // contains "John"
```

**Note:** "{this}" will be replaced by the readable function's readable value.

### flatMap:

```js
const value = {firstname: "John", lastname: "Doe"};
const getLastName = value => r(value.firstname)`firstname`

r(value)                      `John Doe`
  .flatMap(getLastName)       `{it}'s {this}`
  .print(); // returns "John Doe's firstname"
```


Installation :

`npm install readablejs`

or with yarn:

`yarn add readablejs`

Then import `r`:

```js
import r from "readablejs";
```
