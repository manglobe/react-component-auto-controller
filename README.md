# react-component-auto-controller

[![npm package][npm-badge]][npm]

`An easy way to create controlled-component & uncontrolled-component`

### Demo

https://codesandbox.io/s/hungry-resonance-jiee2?fontsize=14

### Usage

```jsx
// sourse component
const Foo = ({ count, onCountChange }) =>
  console.log(count, onCountChange) || (
    <div onClick={() => onCountChange(count + 1)}> {count}</div>
  );

// with auto-controller HOC
import AutoController from "react-component-auto-controller";
const NewFoo = AutoController({
  value: "count",
  onChange: "onCountChange",
  defaultValue: "defaultCount"
})(Foo);

// as controlled:
function Usage1() {
  const [count, setCount] = React.useState(0);
  return <NewFoo count={count} onCountChange={v => setCount(v)} />;
}

// as uncontrolled:
const Usage2 = () => {
  return <NewFoo defaultCount={0} />;
};
```

[npm-badge]: https://img.shields.io/npm/v/react-component-auto-controller.png?style=flat-square
[npm]: https://www.npmjs.org/package/react-component-auto-controller
