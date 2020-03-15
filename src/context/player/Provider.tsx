import React, { ClipboardEvent, FC, useCallback, useState } from "react";
import { Form } from "react-bootstrap";

import FormModal from "../../components/Form/Modal";
import validate from "../../types/json.validator";
import NavigationProvider from "../navigation/Provider";
import { PlayerContext } from "./index";

const PlayerProvider: FC = ({ children }) => {
  const playerCache = localStorage.getItem("player");
  const [invalid, setInvalid] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [player, setPlayer] = useState<Player | null>(
    playerCache && JSON.parse(playerCache)
  );
  const [show, setShow] = useState(false);
  const handleJson = useCallback(playerJson => {
    try {
      const nextPlayer = JSON.parse(playerJson);
      validate(nextPlayer);
      localStorage.setItem("player", playerJson);
      setPlayer(nextPlayer);
      setShow(false);
      window.setTimeout(() => {
        setInvalid(undefined);
        setLoading(false);
      }, 400);
    } catch (error) {
      const errorString = error.toString();
      localStorage.removeItem("player");
      setInvalid(errorString);
      setLoading(false);
    }
  }, []);
  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    setLoading(true);
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const playerJson = clipboardData && clipboardData.getData("Text");
    if (playerJson) {
      event.stopPropagation();
      event.preventDefault();
      window.setTimeout(() => handleJson(playerJson), 100);
    }
  };
  const handleSubmit = ({ playerJson }: { playerJson: string }) => {
    setLoading(true);
    window.setTimeout(() => handleJson(playerJson), 100);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <PlayerContext.Provider value={player}>
      <FormModal
        className="Player-modal"
        loading={loading}
        onHide={handleClose}
        onValidSubmit={handleSubmit}
        show={show}
        title="Import Player Profile"
      >
        <Form.Group controlId="playerJson">
          <Form.Label className="Player-label">
            <span>
              Log into, load and copy all raw data from{" "}
              <a
                href="https://stt.disruptorbeam.com/player?client_api=12"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://stt.disruptorbeam.com/player
              </a>
              .
            </span>
          </Form.Label>
          <Form.Control
            as="textarea"
            name="playerJson"
            onPaste={handlePaste}
            placeholder={invalid || "Paste raw JSON data here."}
            required={true}
            rows={5}
          />
        </Form.Group>
      </FormModal>
      <NavigationProvider
        onClickImport={handleShow}
        playerName={player && player.player.character.display_name}
      >
        {children}
      </NavigationProvider>
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
