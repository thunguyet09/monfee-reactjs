import React, { createContext, useState } from "react";
export const ThemeContext = createContext();

export const ThemeProvider = (props) => {
  const [mode, setMode] = useState()

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {props.children}
    </ThemeContext.Provider>
  );
};