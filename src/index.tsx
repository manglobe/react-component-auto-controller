import React from "react";
/**
 * @param translate  @example {value: 'state', onChange: 'onChangeState' , defaultValue: 'defaultState' }
 * @param OldComponent sourse component
 * @returns new component
 *
 */
const { PureComponent } = React;
export interface State {
  value: any;
}

type DynamicProps = { [key: string]: any };
type ComponentType = "controlled" | "uncontrolled";
const ControllSwitchHoc = ({
  value: textValue = "value",
  onChange: textOnChange = "onChange",
  defaultValue: textDefaultValue = "defaultValue"
}: {
  value?: string;
  onChange?: string;
  defaultValue?: string;
} = {}) => <OldComponentProps extends {}>(
  OldComponent: React.ComponentType<OldComponentProps>
) => {
  const { name } = OldComponent;
  type NewProps = OldComponentProps & DynamicProps;
  class NewComponent extends PureComponent<NewProps, State> {
    componentType: ComponentType;
    constructor(props: NewProps) {
      super(props);
      this.state = {
        value: void 0
      };
      this.componentType = this.checkProps(props);
    }

    componentWillReceiveProps(nextProps: NewProps) {
      const nextComponentType = this.checkProps(nextProps);
      if (
        this.componentType === "controlled" &&
        nextComponentType === "uncontrolled"
      ) {
        console.error(
          `Can't change \`${name}\` from controlled to uncontrolled`
        );
      }
      this.componentType = nextComponentType;
    }
    checkProps = (props: any) => {
      const value = props[textValue];
      const defaultValue = props[textDefaultValue];
      if (value !== void 0 && defaultValue !== void 0) {
        console.error(
          name +
            " must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://fb.me/react-controlled-components" +
            `\n请不要在 <${name}> 组件内同时声明\`defaultValue\`和\`value\``
        );
        return "controlled";
      }
      if (value !== void 0 && defaultValue === void 0) {
        return "controlled";
      }
      if (value === void 0) {
        return "uncontrolled";
      }
      return "controlled";
    };
    onChange = (...args: any[]) => {
      const onChange = (this.props as any)[textOnChange];

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
    };
    render() {
      const { props, componentType } = this;
      const defaultValue = props[textDefaultValue];
      const { forwardedRef } = props;

      if (componentType === "controlled") {
        return <OldComponent ref={forwardedRef} {...this.props} />;
      }
      if (componentType === "uncontrolled") {
        return (
          <OldComponent
            ref={forwardedRef}
            {...this.props}
            {...{
              [textValue]:
                this.state.value === void 0 ? defaultValue : this.state.value,
              [textOnChange]: this.onChange
            }}
          />
        );
      }
    }
  }
  return React.forwardRef(
    (
      props: Pick<DynamicProps, Exclude<keyof DynamicProps, "ref">> &
        OldComponentProps,
      ref: any
    ) => <NewComponent {...props as any} forwardedRef={ref} />
  );
};

export default ControllSwitchHoc;
