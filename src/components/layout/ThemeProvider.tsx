
import { createContext, useContext, ReactNode } from "react";

interface ThemeContextType {
  theme: "light";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always use light theme
  const theme = "light";

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
