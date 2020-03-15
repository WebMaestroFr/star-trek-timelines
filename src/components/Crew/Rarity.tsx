import React, { FC } from "react";

import Icon from "../Icon";

const CrewRarity: FC<{ maxRarity: number; rarity?: number | null }> = ({
  maxRarity,
  rarity
}) => {
  if (rarity) {
    return (
      <span className="CrewRarity">
        {[...Array(rarity)].map((_, key) => (
          <Icon className="active" name="star" key={key} />
        ))}
        {[...Array(maxRarity - rarity)].map((_, key) => (
          <Icon className="inactive" name="star" key={key} />
        ))}
      </span>
    );
  }
  return (
    <span className="CrewRarity">
      {[...Array(maxRarity)].map((_, key) => (
        <Icon className="inactive" name="star" key={key} />
      ))}
    </span>
  );
};

export default CrewRarity;
