// frontend/src/context/ThemeContext.jsx
import { useEffect, useState } from "react";
import ThemeContext from "./theme-context";

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark:bg-gray-900");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark:bg-gray-900");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};