import { Button } from "@shadcn/Button";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useConfigStore } from "../lib/store";
import { cn } from "@/lib/utils";

export const ThemeSwitchButton = ({
  buttonClassName,
  iconClassName,
}: {
  buttonClassName?: string;
  iconClassName?: string;
}) => {
  const theme = useConfigStore.use.theme();
  const setTheme = useConfigStore.use.setTheme();

  useEffect(() => {
    console.log("Current theme:", theme);
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("size-8 relative overflow-hidden", buttonClassName)}
      size={"sm"}
      aria-label="Toggle theme"
    >
      <AnimatePresence>
        {theme === "dark" ? (
          <motion.div
            key="theme-sun"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <IconSun aria-label="Light Theme" className={iconClassName} />
          </motion.div>
        ) : (
          <motion.div
            key="theme-moon"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <IconMoon aria-label="Dark Theme" className={iconClassName} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};
