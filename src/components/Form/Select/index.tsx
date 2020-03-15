import classNames from "classnames";
import React, {
  Children,
  FC,
  FormEvent,
  HTMLProps,
  ReactElement,
  Ref,
  useEffect,
  useRef
} from "react";

const FormSelect: FC<HTMLProps<HTMLSelectElement> & {
  defaultValue?: string | string[];
  value?: string | string[];
}> = ({ children, className, onChange, value, ...props }) => {
  const handleChange = onChange || ((e: FormEvent) => e.preventDefault());
  const ref: Ref<HTMLSelectElement> = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const event = new Event("change", { bubbles: true });
      ref.current.dispatchEvent(event);
    }
  }, [value]);

  const items = (Children.toArray(children) as ReactElement[]).filter(
    item => item.props.value
  );
  const options = items.map(item => (
    <option key={item.props.value} value={item.props.value}>
      {item.props.value}
    </option>
  ));

  return (
    <select
      className={classNames("FormSelect", className)}
      onChange={handleChange}
      ref={ref}
      value={value}
      {...props}
    >
      <option />
      {options}
    </select>
  );
};

export default FormSelect;
