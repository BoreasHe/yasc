import { cn } from "@/lib/utils";

export function AppInfo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-row gap-2 mt-2 px-0.5 justify-between w-full",
        className,
      )}
    >
      <div className="text-[10px] text-muted-foreground/50">
        Copyright © {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/BoreasHe"
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-dashed hover:text-muted-foreground"
        >
          Boreas He
        </a>
        . Licensed under AGPL v3. Made with ☕
      </div>
      <div className="text-[10px] text-muted-foreground/50">v1.0</div>
    </div>
  );
}
