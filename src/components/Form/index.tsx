import classNames from "classnames";
import React, { FC, FormEvent, useState } from "react";
import { Form, FormProps } from "react-bootstrap";

import { optionsArray } from "../../utils";

const FormValid: FC<FormProps & {
  className: string;
  disabled?: boolean;
  onSubmit?: undefined;
  onValidSubmit: (data: any, form: HTMLFormElement) => void;
}> = ({ children, className, disabled, onValidSubmit, ...props }) => {
  const [validated, setValidated] = useState<boolean>(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const isValid = form.checkValidity();
    event.preventDefault();
    event.stopPropagation();
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
    const formData = Array.prototype.reduce.call(
      form.elements,
      (data: any, { multiple, name, options, value }: HTMLFormElement) => {
        const actualValue =
          multiple && options instanceof HTMLOptionsCollection
            ? optionsArray(options).map(
                (option: HTMLOptionElement) => option.value
              )
            : value;
        return name === ""
          ? data
          : {
              [name]: actualValue,
              ...data
            };
      },
      {}
    );
    // console.warn({ formData });
    if (isValid) {
      onValidSubmit(formData, form);
    } else {
      const invalid: HTMLElement | null = form.querySelector(":invalid");
      if (invalid) {
        invalid.focus();
      }
    }
    setValidated(true);
  };

  return (
    <Form
      className={classNames(
        "FormValid",
        className,
        disabled && "FormValid-disabled"
      )}
      noValidate={true}
      onSubmit={handleSubmit}
      validated={validated}
      {...props}
    >
      {children}
    </Form>
  );
};

export default FormValid;
