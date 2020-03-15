interface Player {
  action: "update";
  player: {
    character: {
      crew: PlayerCrew[];
      display_name: string;
    };
    dbid: number;
    id: number;
  };
}

type SkillName =
  | "command_skill"
  | "diplomacy_skill"
  | "engineering_skill"
  | "medicine_skill"
  | "science_skill"
  | "security_skill";

interface Skill {
  core: number;
  range_max: number;
  range_min: number;
}

interface Skills {
  [name: SkillName]: Skill | undefined;
}

interface Crew {
  max_rarity: number;
  name: string;
}

interface PlayerCrew extends Crew {
  base_skills: Skills;
  id: number;
  rarity: number;
}

interface DataCrew extends Crew {
  image: string | undefined;
  max_skills: Skills;
  key: string;
  url: string;
}

interface SkillsCrew {
  [name: SkillName]: DataCrew;
}

interface SkillsPlayerCrew {
  [name: SkillName]: PlayerCrew;
}

interface DiffSkills {
  [name: SkillName]: number;
}

interface StatsCrew extends DataCrew {
  active: PlayerCrew | null | undefined;
  currentSkillsSum: number;
  diffSkills: DiffSkills;
  diffSkillsAvg: number;
  maxSkillsSum: number;
  skillsProgress: number;
}

interface Stats {
  bestCrew: SkillsCrew;
  bestSkills: Skills;
  crew: StatsCrew[];
  playerBestCrew: SkillsPlayerCrew;
  playerBestSkills: Skills;
}
