import classNames from "classnames";
import React, {
  Children,
  cloneElement,
  FC,
  HTMLProps,
  ReactChildren,
  ReactElement,
  useState
} from "react";
import { Button, ButtonProps, Col, Form } from "react-bootstrap";

import FormSelect from "./index";

export const FormSelectCol: FC<ButtonProps & {
  value: string;
}> = ({ children, ...props }) => (
  <Button variant="light" {...props}>
    {children}
  </Button>
);

export const FormSelectRow: FC<HTMLProps<HTMLSelectElement> & {
  children: ReactElement<
    ButtonProps & {
      active?: boolean;
      children: ReactChildren;
      onClick?: (e: MouseEvent) => void;
      value: string;
    }
  >[];
  className?: string;
  defaultValue?: string | string[];
  size: number;
  value?: undefined;
}> = ({ children, className, defaultValue, multiple, size, ...props }) => {
  const [value, setValue] = useState<string | string[]>(
    defaultValue || (multiple ? [] : "")
  );
  const handleClick = (eventKey: string) => () => {
    if (Array.isArray(value)) {
      const nextValue = value.includes(eventKey)
        ? value.filter(v => v !== eventKey)
        : [...value, eventKey];
      setValue(nextValue);
    } else {
      setValue(eventKey);
    }
  };

  const gridItems = (Children.toArray(children) as ReactElement[]).filter(
    item => item.props.value
  );
  const gridCols = gridItems.map(item => (
    <Col sm={size} key={item.props.value}>
      {cloneElement(item, {
        active: Array.isArray(value)
          ? value.includes(item.props.value)
          : item.props.value === value,
        onClick: handleClick(item.props.value)
      })}
    </Col>
  ));

  return (
    <>
      <FormSelect
        className="FormSelectDropdown-select"
        multiple={multiple}
        value={value}
        {...props}
      >
        {children}
      </FormSelect>
      <Form.Row className={classNames("FormSelectRow", className)}>
        {gridCols}
      </Form.Row>
    </>
  );
};
