import { createContext, useContext } from "react";

export const defaultNavigation = { filter: "" };

export const NavigationContext = createContext<{ filter: string }>(
  defaultNavigation
);

export default () => useContext(NavigationContext);
