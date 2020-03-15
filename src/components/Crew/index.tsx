import classNames from "classnames";
import React, { FC } from "react";
import { Card } from "react-bootstrap";
import LazyLoad from "react-lazyload";

import SkillProgress from "../Skill";
import CrewLevel from "./Level";
import CrewRarity from "./Rarity";

const Crew: FC<{ crew: StatsCrew }> = ({ crew: { active, ...crew } }) => {
  return (
    <Card
      className={classNames("Crew", `rarity-${crew.max_rarity}`, {
        active,
        inactive: active === undefined
      })}
    >
      <LazyLoad height={500} offset={750}>
        <Card.Img variant="top" src={`./crew/${crew.key}.png`} />
        <Card.Body>
          <CrewRarity
            maxRarity={crew.max_rarity}
            rarity={active && active.rarity}
          />
          <CrewLevel skillsProgress={crew.skillsProgress} />
          <Card.Title>{crew.name}</Card.Title>
          <Card.Text as="div">
            {Object.entries(crew.max_skills).map(([skillName, skill]) => (
              <SkillProgress
                active={active && active.base_skills}
                key={skillName}
                skill={skill}
                skillName={skillName as SkillName}
              />
            ))}
          </Card.Text>
        </Card.Body>
      </LazyLoad>
    </Card>
  );
};

export default Crew;
