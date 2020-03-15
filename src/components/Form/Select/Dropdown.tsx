import classNames from "classnames";
import React, {
  Children,
  FC,
  forwardRef,
  HTMLProps,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from "react";
import { Button, Dropdown } from "react-bootstrap";

import Icon from "../../Icon";
import FormSelect from "./index";

export const FormSelectDropdownItem: FC<{ value: string }> = ({
  value,
  ...props
}) => <Dropdown.Item eventKey={value} {...props} />;

const FormSelectDropdownToggle: FC<{
  onClick: (e: MouseEvent) => void;
}> = forwardRef(({ onClick, ...props }, ref) => {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onClick(e);
  };
  return (
    <div
      className="FormSelectDropdownToggle"
      onClick={handleClick}
      ref={ref as any}
      {...props}
    />
  );
});

export const FormSelectDropdown: FC<HTMLProps<HTMLSelectElement> & {
  className?: string;
  defaultValue?: string | string[];
  id: string;
  placeholder?: string;
  value?: undefined;
}> = ({
  children,
  className,
  defaultValue,
  id,
  multiple,
  placeholder,
  disabled,
  ...props
}) => {
  const [value, setValue] = useState<string | string[]>(
    defaultValue || (multiple ? [] : "")
  );

  const handleSelect = (eventKey: string) => {
    if (Array.isArray(value)) {
      const nextValue = value.includes(eventKey)
        ? value.filter(v => v !== eventKey)
        : [...value, eventKey];
      setValue(nextValue);
    } else {
      setValue(eventKey);
    }
  };

  const items = (Children.toArray(children) as ReactElement[]).filter(
    item => item.props.value !== undefined
  );

  const getToggleContent = () => {
    if (Array.isArray(value)) {
      const activeItems = items.filter(item =>
        value.includes(item.props.value)
      );
      if (activeItems.length) {
        return activeItems.map(item => {
          const onClickActive = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            handleSelect(item.props.value);
          };
          return (
            <Button
              key={item.props.value}
              onClick={onClickActive}
              variant="light"
            >
              {item.props.children}
              <Icon name="close" />
            </Button>
          );
        });
      }
    } else {
      const activeItem = items.find(item => item.props.value === value);
      if (activeItem) {
        return activeItem.props.children;
      }
    }
    return (
      <span className="FormSelectDropdown-placeholder">{placeholder}</span>
    );
  };

  const inactiveItems = Array.isArray(value)
    ? items.filter(item => !value.includes(item.props.value))
    : items.filter(item => item.props.value !== value);

  const disabledOrEmpty = disabled || inactiveItems.length === 0;
  const toggleContent = getToggleContent();

  useEffect(() => {
    const onlyAvailableValue = items.length === 1 && items[0].props.value;
    if (onlyAvailableValue) {
      setValue(
        prevValue =>
          (!Array.isArray(prevValue) &&
            !items.find(item => item.props.value === prevValue) &&
            onlyAvailableValue) ||
          prevValue
      );
    }
  }, [items]);

  return (
    <>
      <FormSelect
        className="FormSelectDropdown-select"
        disabled={disabledOrEmpty}
        id={id}
        multiple={multiple}
        value={value}
        {...props}
      >
        {children}
      </FormSelect>
      <Dropdown
        className={classNames(
          "FormSelectDropdown",
          disabled && "FormSelectDropdown-disabled"
        )}
        onSelect={disabledOrEmpty ? undefined : handleSelect}
      >
        <Dropdown.Toggle
          as={FormSelectDropdownToggle as any}
          id={`FormSelectDropdown-${id}`}
        >
          {toggleContent}
        </Dropdown.Toggle>
        {disabledOrEmpty ? null : (
          <Dropdown.Menu>{inactiveItems}</Dropdown.Menu>
        )}
      </Dropdown>
    </>
  );
};
