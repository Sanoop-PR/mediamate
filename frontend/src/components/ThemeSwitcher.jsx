import { createContext } from "react";

const ThemeSwitcher = createContext({
    theme: "",
    setTheme: () => {},
});

export default ThemeSwitcher;