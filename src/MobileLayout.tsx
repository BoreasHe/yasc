import type { LayoutProps } from "./App";
import { AppInfo } from "./components/AppInfo";
import { FormSection } from "./components/FormSection";
import { MobileBottomBar } from "./components/MobileBottomBar";

export function MobileLayout({
  currentRule,
  form,
  preprocessedFormData,
}: LayoutProps) {
  return (
    <div className="relative h-dvh">
      <FormSection rule={currentRule} form={form} className="pb-16" />
      <MobileBottomBar
        rule={currentRule}
        preprocessedFormData={preprocessedFormData}
      />
    </div>
  );
}
