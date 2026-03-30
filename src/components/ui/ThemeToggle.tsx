import * as React from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "./Button";
import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunIcon className="w-4 h-4 text-muted-foreground" />
      ) : (
        <MoonIcon className="w-4 h-4 text-muted-foreground" />
      )}
    </Button>
  );
};

export default ThemeToggle;
