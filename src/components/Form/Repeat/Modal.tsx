import React, { ComponentType, ReactNode, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";

import Icon from "../../Icon";

export const FormRepeatModal = <T extends any>({
  children,
  component: Component,
  create = "Add",
  deleteConfirm = "Are you sure?",
  list,
  setList,
  update = "Edit",
  ...props
}: {
  children: ReactNode;
  component: ComponentType<{
    onHide: () => void;
    onValidSubmit: (item: T, form: HTMLFormElement) => void;
    show: boolean;
    title: string;
    value?: T;
  }>;
  create?: string;
  deleteConfirm?: string;
  list: T[];
  setList: (list: T[]) => void;
  update?: string;
}) => {
  const handleCreate = (item: T) => {
    setList([...list, item]);
    setShow(false);
  };
  const handleUpdateItem = (index: number) => (item: T) => {
    const listData = [...list];
    listData[index] = item;
    setList(listData);
    setShow(false);
  };
  const handleDeleteItem = (index: number) => () => {
    if (!deleteConfirm || window.confirm(deleteConfirm)) {
      const listData = [...list];
      listData.splice(index, 1);
      setList(listData);
    }
  };
  const [show, setShow] = useState<boolean | number>(false);
  const handleHide = () => setShow(false);
  const handleShow = (index: boolean | number = true) => () => setShow(index);

  return (
    <Form.Group className="FormRepeat FormRepeatModal" {...props}>
      {children && list.length ? (
        <Table responsive={true}>
          <thead>
            <tr>
              {children}
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <Component
                  onHide={handleHide}
                  onValidSubmit={handleUpdateItem(index)}
                  show={show === index}
                  title={update}
                  value={item}
                />
                <td>
                  <Button
                    className="FormRepeat-edit"
                    onClick={handleShow(index)}
                    variant="link"
                  >
                    <Icon name="edit" />
                  </Button>
                  <Button
                    className="FormRepeat-delete"
                    onClick={handleDeleteItem(index)}
                    variant="link"
                  >
                    <Icon name="delete" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
      <Button onClick={handleShow()} variant="link">
        <Icon name="add" /> {create}
      </Button>
      {show === true ? (
        <Component
          key={list.length}
          onHide={handleHide}
          onValidSubmit={handleCreate}
          show={true}
          title={create}
        />
      ) : null}
    </Form.Group>
  );
};

export default FormRepeatModal;
