import { createContext, useContext } from "react";

export const PlayerContext = createContext<Player | null>(null);

export default () => useContext(PlayerContext);
