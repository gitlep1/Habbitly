import { createContext } from "react";

const screenVersionContext = createContext();
const themeContext = createContext();
const userContext = createContext();
const habitContext = createContext();
const errorContext = createContext();
const preferencesContext = createContext();

export {
  screenVersionContext,
  themeContext,
  userContext,
  habitContext,
  errorContext,
  preferencesContext,
};
