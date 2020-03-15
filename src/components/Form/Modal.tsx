import classNames from "classnames";
import React, { FC } from "react";
import { Button, Modal, ModalProps, Spinner } from "react-bootstrap";

import Icon from "../Icon";
import FormValid from "./index";

const FormModal: FC<ModalProps & {
  className: string;
  loading?: boolean;
  onHide: () => void;
  onValidSubmit: (data: any, form: HTMLFormElement) => void;
  show: boolean;
  title: string;
}> = ({
  children,
  className,
  loading,
  onHide,
  onValidSubmit,
  show,
  title,
  ...props
}) => (
  <Modal size="lg" show={show} onHide={onHide} {...props}>
    <FormValid
      className={classNames("FormModal", className)}
      onValidSubmit={onValidSubmit}
    >
      <Modal.Header closeButton={true}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      {loading ? (
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="light" />
        </Modal.Body>
      ) : (
        <Modal.Body>{children}</Modal.Body>
      )}
      <Modal.Footer>
        <Button disabled={loading} onClick={onHide} variant="outline-secondary">
          <Icon name="close" /> Cancel
        </Button>
        <Button disabled={loading} type="submit" variant="secondary">
          <Icon name="check" /> {title}
        </Button>
      </Modal.Footer>
    </FormValid>
  </Modal>
);

export default FormModal;
