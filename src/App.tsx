import React, { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";

import "./App.scss";

import CrewCard from "./components/Crew";
import useNavigation from "./context/navigation";
import PlayerProvider from "./context/player/Provider";
import useStats from "./context/stats";
import StatsProvider from "./context/stats/Provider";

const AppCrew: FC = () => {
  const STATS = useStats();
  const NAVIGATION = useNavigation();
  const dataCrew = STATS ? STATS.crew : [];
  return (
    <Row>
      {dataCrew
        .filter(crew => crew.key.replace("-", "").includes(NAVIGATION.filter))
        .map(crew => (
          <Col key={crew.key} sm={6} md={4} lg={3}>
            <CrewCard crew={crew} />
          </Col>
        ))}
    </Row>
  );
};

const App = () => (
  <Container className="App">
    <PlayerProvider>
      <StatsProvider>
        <AppCrew />
      </StatsProvider>
    </PlayerProvider>
  </Container>
);

export default App;
