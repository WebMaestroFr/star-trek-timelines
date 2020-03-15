import React, { FC } from "react";
import { ProgressBar } from "react-bootstrap";

import useStats from "../context/stats";

const getSkillTitle = (skillName: string) => {
  switch (skillName) {
    case "command_skill":
      return "Command";
    case "diplomacy_skill":
      return "Diplomacy";
    case "engineering_skill":
      return "Engineering";
    case "medicine_skill":
      return "Medicine";
    case "science_skill":
      return "Science";
    case "security_skill":
      return "Security";
    default:
      return skillName;
  }
};

const SkillProgress: FC<{
  core: number;
  current: Skill | undefined;
  max: Skill | undefined;
  range_max: number;
  range_min: number;
}> = ({ core, current, max, range_max, range_min, ...props }) => {
  const skillMax = max ? max.core + max.range_max : core + range_max;
  return (
    <ProgressBar {...props}>
      <ProgressBar
        variant="success"
        now={((core + range_min) / skillMax) * 100}
      />
      <ProgressBar
        variant="warning"
        now={((range_max - range_min) / skillMax) * 100}
      />
      {current ? (
        <ProgressBar
          variant="danger"
          now={
            current.core + current.range_max > core + range_max
              ? ((current.core + current.range_max - (core + range_max)) /
                  skillMax) *
                100
              : 0
          }
        />
      ) : null}
    </ProgressBar>
  );
};

const Skill: FC<{
  active?: Skills | null;
  skill: Skill;
  skillName: SkillName;
}> = ({ active, skill, skillName }) => {
  const STATS = useStats();
  if (STATS === null) {
    return null;
  }
  const { bestSkills, playerBestSkills } = STATS;
  const title = getSkillTitle(skillName);
  return (
    <div className="Skill">
      <span className="Skill-label">
        <strong>{title}</strong>
        <span>
          {skill.core}&nbsp;
          <small>
            ({skill.range_min}-{skill.range_max})
          </small>
        </span>
      </span>
      {active ? (
        <SkillProgress
          className="Skill-active"
          current={playerBestSkills && (playerBestSkills as any)[skillName]}
          max={bestSkills && (bestSkills as any)[skillName]}
          {...(active as any)[skillName]}
        />
      ) : null}
      <SkillProgress
        current={playerBestSkills && (playerBestSkills as any)[skillName]}
        max={bestSkills && (bestSkills as any)[skillName]}
        {...skill}
      />
    </div>
  );
};

export default Skill;
