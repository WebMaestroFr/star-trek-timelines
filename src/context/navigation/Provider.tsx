import React, { FC, FormEvent, MouseEvent, useState } from "react";
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
  const handleChangeFilter = (event: FormEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeFilename(event.currentTarget.value).replace(
      "-",
      ""
    );
    setFilter(sanitizedValue);
    window.dispatchEvent(scrollEvent);
  };

  return (
    <NavigationContext.Provider value={{ filter }}>
      <Navbar bg="dark" className="Navigation" expand="lg" variant="dark">
        <Form inline={true}>
          <FormDebounce onChange={handleChangeFilter} placeholder="Filter..." />
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
