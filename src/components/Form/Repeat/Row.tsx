import React, {
  ComponentType,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback
} from "react";
import { Button, Col, Form } from "react-bootstrap";

import Icon from "../../Icon";

export const FormRepeatRow = <T extends any>({
  children,
  create = "Add",
  component: Component,
  disableDelete = false,
  itemDefaults = {} as T,
  list,
  required,
  setList,
  ...props
}: {
  children: ReactNode;
  create?: string;
  component: ComponentType<{
    onChange?: (data: T) => void;
    value: T;
  }>;
  controlId: string;
  disableDelete?: boolean;
  itemDefaults?: T;
  list: T[];
  required?: boolean;
  setList?: Dispatch<SetStateAction<T[]>>;
  [key: string]: any;
}) => {
  const handleAddItem = useCallback(
    () => setList && setList(prevList => [...prevList, itemDefaults]),
    [itemDefaults, setList]
  );
  const handleChangeItem = useCallback(
    (index: number) =>
      setList &&
      ((data: T) =>
        setList(prevList => {
          const nextList = [...prevList];
          nextList[index] = data;
          return nextList;
        })),
    [setList]
  );
  const handleRemoveItem = useCallback(
    (index: number) =>
      setList &&
      (() =>
        setList(prevList => {
          const nextList = [...prevList];
          nextList.splice(index, 1);
          return required && nextList.length === 0 ? prevList : nextList;
        })),
    [required, setList]
  );
  return (
    <Form.Group className="FormRepeat FormRepeatRow">
      {children && list.length ? (
        <Form.Row>
          {children}
          {setList && <Col className="FormRepeat-actions" />}
        </Form.Row>
      ) : null}
      {list.map((item, index) => (
        <Form.Row key={index}>
          <Component
            onChange={handleChangeItem(index)}
            value={item}
            {...props}
          />
          {setList ? (
            <Col className="FormRepeat-actions">
              {disableDelete || (required && list.length === 1) ? null : (
                <Button
                  className="FormRepeat-remove"
                  onClick={handleRemoveItem(index)}
                  variant="link"
                >
                  <Icon name="remove" />
                </Button>
              )}
            </Col>
          ) : null}
        </Form.Row>
      ))}
      {setList ? (
        <Button onClick={handleAddItem} variant="link">
          <Icon name="add" /> {create}
        </Button>
      ) : null}
    </Form.Group>
  );
};

export default FormRepeatRow;
