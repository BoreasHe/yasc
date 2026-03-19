import { Button } from "@shadcn/Button";
import { IconBrandGithub, IconMoon, IconSun } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useConfigStore } from "../lib/store";
import { cn } from "@/lib/utils";

export const GithubButton = ({
  buttonClassName,
  iconClassName,
}: {
  buttonClassName?: string;
  iconClassName?: string;
}) => {
  return (
    <Button
      variant="outline"
      className={cn("size-8 relative overflow-hidden", buttonClassName)}
      size={"sm"}
      aria-label="Github Repository"
      asChild
    >
      <a
        href="https://github.com/boreashe/yasc"
        target="_blank"
        rel="noreferrer noopener"
      >
        <IconBrandGithub className={iconClassName} />
      </a>
    </Button>
  );
};
