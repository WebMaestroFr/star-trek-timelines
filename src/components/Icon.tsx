import {
  faCheck,
  faCheckSquare,
  faSquare,
  faStar,
  faTimes,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { FC, HTMLProps } from "react";

// IF YOU'RE WORKING ON THIS FILE, PLEASE READ THIS FIRST:
// https://fontawesome.com/icons?d=gallery&s=solid&m=free

const getIconFromName = (name: string) => {
  switch (name) {
    case "check":
      return faCheck;
    case "check-off":
      return faSquare;
    case "check-on":
      return faCheckSquare;
    case "close":
      return faTimes;
    case "star":
      return faStar;
    case "users":
      return faUsers;
    default:
      console.warn(`Icon "${name}" not imported.`);
      return null;
  }
};

const Icon: FC<HTMLProps<HTMLSpanElement> & { name: string }> = ({
  className,
  name,
  ...props
}) => {
  const icon = getIconFromName(name);
  return (
    icon && (
      <span className={classNames("Icon", className)} {...props}>
        <FontAwesomeIcon fixedWidth={true} icon={icon} />
      </span>
    )
  );
};

export default Icon;
