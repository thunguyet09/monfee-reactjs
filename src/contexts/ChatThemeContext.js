import React, { createContext, useState, useEffect } from "react";
import { getData } from "../api";
export const ChatThemeContext = createContext();

export const ChatThemeProvider = (props) => {
  const [mode, setMode] = useState('')

  useEffect(() => {
    getChatThemeData()
  }, [mode])

  const getChatThemeData = async() => {
    const chatTheme = await getData('theme/chat')
    setMode(chatTheme.status)
  }
  return (
    <ChatThemeContext.Provider value={{ mode, setMode }}>
      {props.children}
    </ChatThemeContext.Provider>
  );
};