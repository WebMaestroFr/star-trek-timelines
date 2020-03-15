import { createContext, useContext } from "react";

export const StatsContext = createContext<Stats | null>(null);

export default () => useContext(StatsContext);
