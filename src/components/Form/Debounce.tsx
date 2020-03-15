import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { FormControl, FormControlProps } from "react-bootstrap";

type FormControlChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

const FormDebounce: FC<FormControlProps & {
  delay?: number;
  onChange?: (event: FormControlChangeEvent) => void;
  placeholder?: string;
}> = ({ delay = 400, onChange, ...props }) => {
  const [changeEvent, setChangeEvent] = useState<FormControlChangeEvent>();
  useEffect(() => {
    if (onChange && changeEvent) {
      const timeoutCallback = () => onChange(changeEvent);
      const timeoutID = setTimeout(timeoutCallback, delay);
      return () => clearTimeout(timeoutID);
    }
  }, [delay, onChange, changeEvent]);
  const handleChange = (event: FormControlChangeEvent) => {
    event.persist();
    setChangeEvent(event);
  };
  return <FormControl onChange={handleChange} {...props} />;
};

export default FormDebounce;
