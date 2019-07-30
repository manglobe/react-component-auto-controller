function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
/**
 * @param translate  @example {value: 'state', onChange: 'onChangeState' , defaultValue: 'defaultState' }
 * @param OldComponent sourse component
 * @returns new component
 *
 */

const {
  PureComponent
} = React;

const ControllSwitchHoc = ({
  value: textValue = "value",
  onChange: textOnChange = "onChange",
  defaultValue: textDefaultValue = "defaultValue"
} = {}) => OldComponent => {
  const {
    name
  } = OldComponent;

  class NewComponent extends PureComponent {
    constructor(_props) {
      super(_props);

      _defineProperty(this, "componentType", void 0);

      _defineProperty(this, "checkProps", props => {
        const value = props[textValue];
        const defaultValue = props[textDefaultValue];

        if (value !== void 0 && defaultValue !== void 0) {
          console.error(name + " must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://fb.me/react-controlled-components" + `\n请不要在 <${name}> 组件内同时声明\`defaultValue\`和\`value\``);
          return "controlled";
        }

        if (value !== void 0 && defaultValue === void 0) {
          return "controlled";
        }

        if (value === void 0) {
          return "uncontrolled";
        }

        return "controlled";
      });

      _defineProperty(this, "onChange", (...args) => {
        const onChange = this.props[textOnChange];
        const propsOnChangeResult = onChange && onChange(...args);

        if (propsOnChangeResult === false) {
          return false;
        }

        const isDomNode = args[0].target && args[0].target.nodeType === 1;
        let value = args[0];

        if (isDomNode) {
          value = args[0].target.value;
        }

        this.setState({
          value: value
        });
      });

      this.state = {
        value: void 0
      };
      this.componentType = this.checkProps(_props);
    }

    componentWillReceiveProps(nextProps) {
      const nextComponentType = this.checkProps(nextProps);

      if (this.componentType === "controlled" && nextComponentType === "uncontrolled") {
        console.error(`Can't change \`${name}\` from controlled to uncontrolled`);
      }

      this.componentType = nextComponentType;
    }

    render() {
      const {
        props,
        componentType
      } = this;
      const defaultValue = props[textDefaultValue];
      const {
        forwardedRef
      } = props;

      if (componentType === "controlled") {
        return React.createElement(OldComponent, _extends({
          ref: forwardedRef
        }, this.props));
      }

      if (componentType === "uncontrolled") {
        return React.createElement(OldComponent, _extends({
          ref: forwardedRef
        }, this.props, {
          [textValue]: this.state.value === void 0 ? defaultValue : this.state.value,
          [textOnChange]: this.onChange
        }));
      }
    }

  }

  return React.forwardRef((props, ref) => React.createElement(NewComponent, _extends({}, props, {
    forwardedRef: ref
  })));
};

export default ControllSwitchHoc;