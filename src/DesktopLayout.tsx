import type { LayoutProps } from "./App";
import { FormSection } from "./components/FormSection";
import { GithubButton } from "./components/GithubButton";
import { ScoreDisplaySection } from "./components/ScoreDisplaySection";
import { ThemeSwitchButton } from "./components/ThemeSwitchButton";

export function DesktopLayout({
  currentRule,
  form,
  preprocessedFormData,
}: LayoutProps) {
  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="py-4 flex flex-col gap-2">
          <ThemeSwitchButton />
          <GithubButton />
        </div>
        <div className="flex flex-col h-dvh">
          <FormSection rule={currentRule} form={form} />
        </div>
      </div>
      <div className="flex flex-col gap-4 pt-6 max-h-[calc(100dvh-24px)]">
        <ScoreDisplaySection
          rule={currentRule}
          preprocessedFormData={preprocessedFormData}
        />
      </div>
    </>
  );
}
