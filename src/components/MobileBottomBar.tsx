import type { ProfileFormData } from "@/App";
import { MobileScoringSheetControl } from "./MobileScoringSheetControl";
import { ThemeSwitchButton } from "./ThemeSwitchButton";
import type { RuleSet } from "@/lib/rules/rule.types";
import { GithubButton } from "./GithubButton";

export function MobileBottomBar({
  preprocessedFormData,
  rule,
}: {
  preprocessedFormData: ProfileFormData;
  rule: RuleSet;
}) {
  return (
    <div className="fixed bottom-0 right-0 w-full z-1000 pointer-events-auto!">
      <div className="flex flex-row gap-2 items-center p-2 border border-border border-b-0 rounded-t-lg bg-muted mx-4 justify-between">
        <div className="flex flex-row gap-2">
          <ThemeSwitchButton buttonClassName="size-12" iconClassName="size-6" />
          <GithubButton buttonClassName="size-12" iconClassName="size-6" />
        </div>
        <MobileScoringSheetControl
          rule={rule}
          preprocessedFormData={preprocessedFormData}
        />
      </div>
    </div>
  );
}
