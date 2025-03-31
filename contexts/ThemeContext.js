import React, { createContext, useContext, useState } from 'react';

// create the context
const ThemeContext = createContext();

//  hook to use the theme
export const useTheme = () => useContext(ThemeContext);

// theme provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
