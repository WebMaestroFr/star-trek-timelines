import React, { FC } from "react";
import { ProgressBar } from "react-bootstrap";

const CrewRarity: FC<{ skillsProgress: number }> = ({ skillsProgress }) => (
  <ProgressBar className="CrewLevel" now={skillsProgress * 100} />
);

export default CrewRarity;
