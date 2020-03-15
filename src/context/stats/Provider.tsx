import React, { FC, useEffect, useState } from "react";

import { fromEntries } from "../../utils";
import { sanitizeFilename } from "../../utils";
import CREW from "../../__data__/crew.json";
import usePlayer from "../player";
import { StatsContext } from "./index";

const isBetterSkill = (
  bestSkill: Skill | undefined,
  skill: Skill | undefined
) =>
  Boolean(
    skill &&
      (!bestSkill ||
        bestSkill.core + bestSkill.range_max < skill.core + skill.range_max)
  );

const getBestCrew = (best: SkillsCrew, crew: DataCrew) =>
  Object.keys(crew.max_skills).reduce((b, s) => {
    const bestCrew = (best as any)[s];
    const bestSkill = bestCrew && bestCrew.max_skills[s];
    const skill = (crew.max_skills as any)[s] as Skill | undefined;
    return isBetterSkill(bestSkill, skill) ? { ...b, [s]: crew } : b;
  }, best) as SkillsCrew;

const getPlayerBestCrew = (best: SkillsPlayerCrew, crew: PlayerCrew) =>
  Object.keys(crew.base_skills).reduce((b, s) => {
    const bestCrew = (best as any)[s];
    const bestSkill = bestCrew && bestCrew.base_skills[s];
    const skill = (crew.base_skills as any)[s] as Skill | undefined;
    return isBetterSkill(bestSkill, skill) ? { ...b, [s]: crew } : b;
  }, best) as SkillsPlayerCrew;

const getSkillAvg = (skill: Skill | undefined) =>
  skill && skill.core + (skill.range_max + skill.range_min) / 2;

const getSkillsSum = (skills: Skills) =>
  Object.values(skills).reduce<number>((sum: number, skill: Skill) => {
    const avg = getSkillAvg(skill);
    return avg ? sum + avg : 0;
  }, 0);

const StatsProvider: FC = ({ children }) => {
  const PLAYER = usePlayer();
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    const bestCrew = CREW.reduce(getBestCrew, {});
    const playerBestCrew = PLAYER
      ? PLAYER.player.character.crew.reduce(getPlayerBestCrew, {})
      : {};
    const bestSkills = fromEntries(
      Object.entries(bestCrew as SkillsCrew).map(
        ([s, crew]) => [s, crew.max_skills[s]] as [SkillName, Skill]
      )
    ) as Skills;
    const playerBestSkills = fromEntries(
      Object.entries(playerBestCrew as SkillsPlayerCrew).map(
        ([s, crew]) => [s, crew.base_skills[s]] as [SkillName, Skill]
      )
    ) as Skills;
    const toDiffSkills = (
      diffSkills: DiffSkills,
      [skillName, skill]: [string, Skill | undefined]
    ) => {
      if (skill === undefined) {
        return diffSkills;
      }
      const bestSkill = (bestSkills as any)[skillName] as Skill | undefined;
      const bestSkillAvg = getSkillAvg(bestSkill);
      const playerBestSkill = (playerBestSkills as any)[skillName] as
        | Skill
        | undefined;
      const playerBestSkillAvg = getSkillAvg(playerBestSkill);
      const skillAvg = getSkillAvg(skill);
      return playerBestSkillAvg && skillAvg && bestSkillAvg
        ? {
            ...diffSkills,
            [skillName]: 1 + (playerBestSkillAvg - skillAvg) / bestSkillAvg
          }
        : diffSkills;
    };
    setStats({
      bestCrew,
      bestSkills,
      crew: CREW.map(crew => {
        const diffSkills = Object.entries(crew.max_skills).reduce<DiffSkills>(
          toDiffSkills,
          {} as DiffSkills
        );
        const diffSkillsValues = Object.values(diffSkills);
        const diffSkillsAvg =
          diffSkillsValues.reduce<number>((sum, diff) => sum + diff, 0) /
          diffSkillsValues.length;
        const active = PLAYER
          ? PLAYER.player.character.crew.find(
              ({ name }) => sanitizeFilename(name) === crew.key
            )
          : null;
        const currentSkillsSum = active ? getSkillsSum(active.base_skills) : 0;
        const maxSkillsSum = getSkillsSum(crew.max_skills);
        const skillsProgress = currentSkillsSum
          ? Math.min(currentSkillsSum / maxSkillsSum, 1)
          : 0;
        return {
          ...crew,
          active,
          currentSkillsSum,
          diffSkills,
          diffSkillsAvg,
          maxSkillsSum,
          skillsProgress
        };
      })
        .sort((a, b) => {
          const aComplete = a.active
            ? Math.pow(a.skillsProgress, 1 + a.max_rarity - a.active.rarity)
            : 1;
          const bComplete = b.active
            ? Math.pow(b.skillsProgress, 1 + b.max_rarity - b.active.rarity)
            : 1;
          return a.diffSkillsAvg / aComplete - b.diffSkillsAvg / bComplete;
        })
        .sort((a, b) =>
          a.skillsProgress === b.skillsProgress
            ? 0
            : a.skillsProgress === 1
            ? 1
            : -1
        )
        .sort((a, b) => (!a.active === !b.active ? 0 : a.active ? -1 : 1)),
      playerBestCrew,
      playerBestSkills
    });
  }, [PLAYER]);
  return (
    <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>
  );
};

export default StatsProvider;
