import React, { ChangeEvent, FC, MouseEvent, useState } from "react";
import { Button, Form, Navbar } from "react-bootstrap";

import FormDebounce from "../../components/Form/Debounce";
import Icon from "../../components/Icon";
import { sanitizeFilename } from "../../utils";
import { defaultNavigation, NavigationContext } from "./index";

const scrollEvent = new CustomEvent("scroll");

const NavigationProvider: FC<{
  onClickImport: (event: MouseEvent<HTMLButtonElement>) => void;
  playerName: string | null;
}> = ({ children, onClickImport, playerName }) => {
  const [filter, setFilter] = useState<string>(defaultNavigation.filter);
  const [selectedRarities, setSelectedRarities] = useState<boolean[]>(
    defaultNavigation.selectedRarities
  );
  const handleChangeFilter = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const sanitizedValue = sanitizeFilename(event.target.value).replace(
      /-/g,
      ""
    );
    setFilter(sanitizedValue);
    window.dispatchEvent(scrollEvent);
  };
  const handleSelectRarity = (index: number) => () =>
    setSelectedRarities(prev => {
      prev[index] = !prev[index];
      return [...prev];
    });

  return (
    <NavigationContext.Provider value={{ filter, selectedRarities }}>
      <Navbar bg="dark" className="Navigation" expand="lg" variant="dark">
        <Form inline={true}>
          <FormDebounce onChange={handleChangeFilter} placeholder="Filter..." />
          {selectedRarities.map((selected, index) => (
            <Icon
              className={selected ? "active" : "inactive"}
              key={index}
              name="star"
              onClick={handleSelectRarity(index)}
            />
          ))}
        </Form>
        <Navbar.Brand className="ml-auto">
          {playerName || (
            <>
              <abbr title="Star Trek Timelines">STT</abbr> Airlockizer 3000
            </>
          )}
          <Button className="ml-3" onClick={onClickImport} variant="secondary">
            <Icon name="users" /> Import...
          </Button>
        </Navbar.Brand>
      </Navbar>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
