import { createContext, useContext } from "react";

export const defaultNavigation = {
  filter: "",
  selectedRarities: [false, false, true, true, true] as boolean[]
};

export const NavigationContext = createContext<{
  filter: string;
  selectedRarities: boolean[];
}>(defaultNavigation);

export default () => useContext(NavigationContext);
